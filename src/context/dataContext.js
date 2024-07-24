"use client";

import authServices from "@/services/userApiServices";

const { createContext, useContext, useEffect, useState } = require("react");

const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const [getUser, setGetUser] = useState("");

	const getUserFnc = async () => {
		try {
			const res = await authServices.getUser();
			setGetUser(res.data.data);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		getUserFnc();
	}, []);

	return (
		<DataContext.Provider value={{ getUser, getUserFnc, setGetUser }}>
			{children}
		</DataContext.Provider>
	);
};

export const useData = () => useContext(DataContext);
