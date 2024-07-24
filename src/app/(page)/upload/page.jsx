"use client";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useData } from "@/context/dataContext";
import fileServices from "@/services/fileApiServices";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Upload = () => {
	const { getUserFnc } = useData();
	const [setIsPassword, setSetIsPassword] = useState(false);
	const [setIsShareable, setSetIsShareable] = useState(true);
	const [baseURL, setBaseURl] = useState("");
	const [shareLink, setShareLink] = useState("");
	const [isShareableOrNot, setIsShareableOrNot] = useState(true);

	const form = useForm({
		defaultValues: {
			image: "",
			password: "",
			isPasswordProtected: "",
			isFileShareable: "",
		},
	});

	const { watch, register, setValue, reset } = form;
	const file = watch("image");
	const isPassword = watch("isPasswordProtected");
	const isShareable = watch("isFileShareable");

	useEffect(() => {
		setValue("isPasswordProtected", setIsPassword);
		setValue("isFileShareable", setIsShareable);
		setBaseURl(`${window.location.protocol}//${window.location.host}`);
	}, [setIsPassword, setIsShareable, setValue]);

	const changeValueIsPassword = () => {
		!setIsPassword ? setSetIsPassword(true) : setSetIsPassword(false);
		setValue("isPasswordProtected", setIsPassword);
	};
	const changeValueIsShareable = () => {
		setIsShareable ? setSetIsShareable(false) : setSetIsShareable(true);
		setValue("isFileShareable", setIsShareable);
	};

	const onSubmit = async (data) => {
		try {
			const response = fileServices.createFile({
				image: data.image[0],
				password: data.password,
				isPasswordProtected: data.isPasswordProtected,
				isFileShareable: data.isFileShareable,
			});

			toast.promise(response, {
				loading: "Please wait file is uploading...",
				success: (res) => res.data.message,
				error: (err) => err?.response.data.message,
			});

			const res = await response;

			reset({
				image: "",
				password: "",
				isPasswordProtected: false,
				isFileShareable: true,
			});
			setSetIsPassword(false);
			setSetIsShareable(true);
			setShareLink(`${baseURL}/shareable-link/${res.data.data._id}`);
			setIsShareableOrNot(res.data.data.isFileShareable);
			getUserFnc();
		} catch (err) {
		} finally {
			setTimeout(() => {
				setShareLink("");
			}, 30 * 1000);
		}
	};

	const copyUrl = () => {
		window.navigator.clipboard.writeText(shareLink);
		toast.message("link copied !!", {
			description: shareLink,
		});
	};

	return (
		<>
			<div>
				<Container>
					<div className="flex flex-wrap-reverse gap-5 mb-7 lg:mt-20">
						<div className="w-full md:w-[400px]  px-5 py-10 shadow-xl rounded-xl">
							<div className="">
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-5"
										encType="multipart/form-data"
										method="post"
									>
										<FormField
											control={form.control}
											name="image"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Select file</FormLabel>
													<FormControl>
														<Input
															type="file"
															name="image"
															{...register("image")}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="lg:flex items-center justify-between pr-5">
											<FormField
												control={form.control}
												name="isPasswordProtected"
												render={({ field }) => (
													<FormItem className="flex items-center gap-3">
														<FormLabel className="mt-2">
															Password Protected
														</FormLabel>
														<FormControl>
															<Switch
																{...register("isPasswordProtected")}
																checked={isPassword}
																onCheckedChange={changeValueIsPassword}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="isFileShareable"
												render={({ field }) => (
													<FormItem className="flex items-center gap-3">
														<FormLabel className="mt-2">Shareable</FormLabel>
														<FormControl>
															<Switch
																{...register("isFileShareable")}
																checked={isShareable}
																onCheckedChange={changeValueIsShareable}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<Input
															type="password"
															name="password"
															disabled={!setIsPassword}
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Button type="submit">Submit</Button>
									</form>
								</Form>
							</div>
						</div>

						<div className="w-full md:flex-1 p-5 space-y-3 mt-5 lg:mt-0">
							<div className="text-center space-y-2">
								<h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
									Send Big Files
								</h1>
								<h4 className="text-2xl md:text-3xl">Simple. Fast. Secure</h4>
							</div>

							{isShareableOrNot ? (
								shareLink && (
									<div className="lg:flex justify-center p-3 lg:p-10">
										<div className="space-y-2">
											<p>
												Your transfer has been created and ready to be shared
											</p>
											<div className="flex gap-2">
												<input
													type="text"
													value={shareLink}
													readOnly
													className="outline-none px-4 py-2 bg-slate-200 rounded-lg w-96 cursor-default"
												/>
												<div
													className=" flex items-center justify-center bg-slate-200 rounded-lg px-2 cursor-pointer"
													onClick={() => copyUrl()}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 24 24"
														width="24"
														height="24"
														color="#000"
														fill="none"
													>
														<path
															d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path
															d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</div>
											</div>
										</div>
									</div>
								)
							) : (
								<div className="lg:flex justify-center p-3 lg:p-10">
									<p>
										Your transfer is not shareable. Go to profile to access the
										file
									</p>
								</div>
							)}
						</div>
					</div>
				</Container>
			</div>
		</>
	);
};

export default Upload;
