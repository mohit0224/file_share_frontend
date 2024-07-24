"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import fileServices from "@/services/fileApiServices";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
	const { id } = useParams();
	const [data, setdata] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);
	const [isPassword, setIsPassword] = useState(false);
	const [enterPassword, setEnterPassword] = useState("");
	const [preview, setPreview] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const res = await fileServices.getSingleFile(id);
				setIsLoading(false);
				setdata(res.data.data);
			} catch (err) {
				setIsLoading(false);
				setErrorMessage(err.response.data.message);
				setdata("");
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (!isPassword) setEnterPassword("");
	}, [isPassword]);

	const handleDownload = async () => {
		try {
			const response = await fileServices.downloadFile(id, enterPassword);
			const image = data.imageName;

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", image);

			document.body.appendChild(link);
			link.click();

			link.parentNode.removeChild(link);
		} catch (err) {
			const reader = new FileReader();
			reader.onload = () => {
				const errMessage = JSON.parse(reader.result).message;
				toast.error(errMessage);
			};
			reader.readAsText(err.response.data);
		}
	};

	return (
		<>
			<div>
				{isLoading ? (
					<div className="h-screen w-screen flex items-center justify-center">
						<h5>Loading...</h5>
					</div>
				) : data ? (
					<Container>
						<div className="lg:flex gap-5 mt-5 lg:mt-10">
							<div className="lg:w-[400px] h-96  px-5 py-10 shadow-xl rounded-xl ">
								<div className="space-y-5">
									<input
										type="text"
										disabled
										className="w-full outline-none px-4 py-2 text-lg rounded-lg border border-slate-100 text-slate-950"
										defaultValue={data.imageName}
									/>

									<div className="flex items-center gap-3 px-4">
										<label htmlFor="password" className="text-sm">
											Password ?
										</label>
										<input
											type="checkbox"
											name="isPassword"
											id="isPassword"
											onChange={(e) => setIsPassword(e.target.checked)}
											className="w-4 h-4 accent-slate-950"
										/>
									</div>

									<input
										type="password"
										name="password"
										id="password"
										disabled={!isPassword}
										value={enterPassword}
										placeholder="Enter your password"
										onChange={(e) => setEnterPassword(e.target.value)}
										className="w-full outline-none px-4 py-2 rounded-lg border border-slate-100 text-slate-950"
									/>

									<Button
										className="w-full"
										onClick={() => setPreview(!preview)}
									>
										Preview
									</Button>

									<Button className="w-full" onClick={() => handleDownload()}>
										Download
									</Button>
								</div>
							</div>

							<div className="p- lg:flex-1 my-10 lg:mt-0 flex justify-center ">
								<img
									src={data.imageURL}
									alt={data.imageName}
									className={`h-96 ${preview ? "block" : "hidden"}`}
								/>
							</div>
						</div>
					</Container>
				) : (
					<div>
						<div className="h-screen w-screen flex items-center justify-center">
							<h5>{errorMessage}</h5>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Page;
