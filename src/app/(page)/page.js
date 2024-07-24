"use client";

import Container from "@/components/Container";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
	const router = useRouter();
	const handleClick = () => {
		router.push("/login");
	};
	return (
		<div className="">
			<Container className={"lg:pt-0"}>
				<div className="h-screen flex flex-wrap ">
					<div className="w-full md:flex-1 ">
						<div className="h-full flex flex-col justify-center  space-y-5">
							<h1 className="text-6xl font-semibold pr-40">
								Share your daily lifestyle activities.
							</h1>
							<h3 className="text-lg">Simple.Fast.Secure</h3>
							<button
								className="w-40 px-4 py-2 border border-slate-300 rounded-3xl"
								onClick={handleClick}
							>
								Login
							</button>
						</div>
					</div>

					<div className="w-full md:flex-1">
						<div className="w-full h-full flex items-center justify-center">
							<div className="hidden md:block w-[90%] h-[90%] bg-[url('/bg.webp')] bg-contain bg-no-repeat bg-center"></div>
							<div className="block md:hidden w-[90%] h-[90%] bg-[url('/homeBg.webp')] bg-contain bg-no-repeat bg-center"></div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default page;
