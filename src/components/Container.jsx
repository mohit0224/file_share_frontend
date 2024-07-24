import React from "react";

const Container = ({ children, className }) => {
	return (
		<div className={`${className} container mx-auto pt-24 lg:px-16`}>
			{children}
		</div>
	);
};

export default Container;
