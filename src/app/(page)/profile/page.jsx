"use client";
import React, { useEffect, useState } from "react";
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
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useData } from "@/context/dataContext";
import fileServices from "@/services/fileApiServices";
import authServices from "@/services/userApiServices";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

const Profile = () => {
	const { getUser, getUserFnc } = useData();
	const files = getUser.files;

	const [isPassword, setIsPassword] = useState(false);
	const [password, setPassword] = useState("");
	const [baseURL, setBaseURL] = useState("");

	useEffect(() => {
		if (!isPassword) setPassword("");
		setBaseURL(`${window.location.protocol}//${window.location.host}`);
	}, [isPassword]);

	const form = useForm({
		defaultValues: {
			oldPassword: "",
			newPassword: "",
		},
	});

	const formImage = useForm({
		defaultValues: {
			userImage: "",
		},
	});

	const { watch, register } = formImage;
	const userImage = watch("userImage");

	const onSubmit = async (data) => {
		try {
			const response = authServices.changePassword(data);
			toast.promise(response, {
				loading: "Please wait...",
				success: (res) => res.data.message,
				error: (err) => err?.response.data.message,
			});
			await response;
			form.reset({
				oldPassword: "",
				newPassword: "",
			});
		} catch (err) {}
	};

	const handleDelete = async (id) => {
		try {
			const response = fileServices.deleteFile(id);
			toast.promise(response, {
				loading: "Please wait file is deleting...",
				success: (res) => res.data.message,
				error: (err) => err?.response.data.message,
			});
			await response;
			getUserFnc();
		} catch (err) {}
	};
	const handleDownload = async (id, imageName) => {
		try {
			const response = await fileServices.downloadFile(id, password);
			const image = imageName;

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
			reader.readAsText(err.response?.data);
		}
	};

	const handleShare = (id) => {
		window.navigator.clipboard.writeText(`${baseURL}/shareable-link/${id}`);
		toast.message("link copied !!", {
			description: `${baseURL}/shareable-link/${id}`,
		});
	};

	const handleImageUpdate = async (data) => {
		try {
			const response = authServices.updateProfileImage({
				userImage: data.userImage[0],
			});

			toast.promise(response, {
				loading: "Please wait image is uploading...",
				success: (res) => res.data.message,
				error: (err) => err?.response.data.message,
			});

			await response;
			getUserFnc();
		} catch (err) {}
	};

	return (
		<>
			<div>
				<Container>
					<div className="lg:flex py-5 items-center gap-10 px-0 lg:px-16">
						<div className="flex justify-center ">
							<div className="h-52 w-52 rounded-full shadow-xl flex items-center justify-center relative">
								<div className="absolute -top-5 -right-5">
									<Sheet>
										<SheetTrigger asChild>
											<Pencil className="cursor-pointer" />
										</SheetTrigger>
										<SheetContent>
											<SheetHeader>
												<SheetTitle>Edit profile</SheetTitle>
												<SheetDescription>
													Make changes to your profile here. Click save when
													you&apos;re done.
												</SheetDescription>
											</SheetHeader>
											<div className="grid gap-4 py-4">
												<Form {...formImage}>
													<form
														onSubmit={formImage.handleSubmit(handleImageUpdate)}
														className="space-y-5"
														encType="multipart/form-data"
														method="post"
													>
														<FormField
															control={formImage.control}
															name="userImage"
															render={({ field }) => (
																<FormItem>
																	<FormLabel>Select profile image</FormLabel>
																	<FormControl>
																		<Input
																			type="file"
																			name="userImage"
																			{...register("userImage")}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>

														<SheetFooter>
															<SheetClose asChild>
																<Button type="submit">Save changes</Button>
															</SheetClose>
														</SheetFooter>
													</form>
												</Form>
											</div>
										</SheetContent>
									</Sheet>
								</div>

								<div className="w-full h-full  rounded-full overflow-hidden">
									<Image
										priority
										src={getUser.userImage ? getUser.userImage : "/user.webp"}
										alt="user"
										width={100}
										height={100}
										className="w-full h-full object-cover object-[center_top]"
									/>
								</div>
							</div>
						</div>
						<div className="bg-gray-20 flex-1 mt-5 lg:mt-0 py-2 ">
							<div className="space-y-3">
								<h5>
									Name : <strong>{getUser.name}</strong>
								</h5>
								<h5>
									Email : <strong>{getUser.email}</strong>
								</h5>
								<h5>
									User Id : <strong>{getUser.username}</strong>
								</h5>

								<Sheet>
									<SheetTrigger asChild>
										<Button variant="outline">Edit Password</Button>
									</SheetTrigger>
									<SheetContent>
										<SheetHeader>
											<SheetTitle>Edit password</SheetTitle>
											<SheetDescription>
												Make changes to your password here. Click save when
												you&apos;re done.
											</SheetDescription>
										</SheetHeader>
										<div className="grid gap-4 py-4">
											<Form {...form}>
												<form
													onSubmit={form.handleSubmit(onSubmit)}
													className="space-y-5"
												>
													<FormField
														control={form.control}
														name="oldPassword"
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Input
																		type="password"
																		placeholder="Old Password"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name="newPassword"
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<Input
																		type="password"
																		placeholder="New Password"
																		{...field}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<SheetFooter>
														<SheetClose asChild>
															<Button type="submit" className="w-full">
																Save password
															</Button>
														</SheetClose>
													</SheetFooter>
												</form>
											</Form>
										</div>
									</SheetContent>
								</Sheet>
							</div>
						</div>
					</div>

					<div className="py-5 px-0 lg:px-16">
						<h2 className="text-xl text-slate-950">All activated link</h2>
						<div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3 justify-items-center ">
							{files?.length > 0 ? (
								files?.map((file) => (
									<div
										className="w-full lg:w-80  border p-3 rounded-xl space-y-3"
										key={file._id}
									>
										<div>
											<input
												type="text"
												defaultValue={file.imageName}
												disabled
												className="w-full px-4 py-2 rounded-lg border border-slate-200"
											/>
										</div>

										<div className="px-1 space-y-3">
											<div className="flex items-center gap-3">
												<label htmlFor="password" className="text-sm">
													Password protected
												</label>
												<input
													type="checkbox"
													name="password"
													id="password"
													className="accent-slate-950"
													checked={isPassword === file._id}
													onChange={(e) =>
														e.target.checked
															? setIsPassword(file._id)
															: setIsPassword("")
													}
												/>
											</div>

											{isPassword === file._id && (
												<input
													type="password"
													placeholder="Enter your password"
													className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
													onChange={(e) => setPassword(e.target.value)}
												/>
											)}
										</div>

										<div className="flex items-center justify-between px-3">
											<button
												className="text-red-500"
												onClick={() => handleDelete(file._id)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													fill="none"
												>
													<path
														d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</button>

											<button
												className="text-blue-500"
												onClick={() => handleDownload(file._id, file.imageName)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													fill="none"
												>
													<path
														d="M12 15L12 5M12 15C11.2998 15 9.99153 13.0057 9.5 12.5M12 15C12.7002 15 14.0085 13.0057 14.5 12.5"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M5 19H19.0001"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</button>

											<Link
												href={`${
													file.isFileShareable &&
													`${baseURL}/shareable-link/${file._id}`
												}`}
												className="text-violet-500"
												target="_blank"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													fill="none"
												>
													<path
														d="M9.521 14.4356L14.434 9.52258"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
													/>
													<path
														d="M12.569 15.1084C13.3087 16.2488 13.1113 17.4178 12.2568 18.2723L9.26158 21.2675C8.28318 22.2459 6.69687 22.2459 5.71847 21.2675L2.73234 18.2814C1.75393 17.303 1.75393 15.7167 2.73234 14.7383L5.72755 11.743C6.42949 11.0411 7.76361 10.6357 8.91007 11.4659M15.1088 12.5685C16.2492 13.3082 17.4182 13.1109 18.2727 12.2564L21.2679 9.26114C22.2463 8.28273 22.2463 6.69641 21.2679 5.718L18.2818 2.73185C17.3034 1.75344 15.7171 1.75344 14.7387 2.73185L11.7434 5.72709C11.0415 6.42903 10.6362 7.76315 11.4664 8.90962"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</Link>

											<button
												disabled={!file.isFileShareable}
												className="text-rose-500"
												onClick={() => handleShare(file._id)}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width="24"
													height="24"
													fill="none"
												>
													<path
														d="M21 6.5C21 8.15685 19.6569 9.5 18 9.5C16.3431 9.5 15 8.15685 15 6.5C15 4.84315 16.3431 3.5 18 3.5C19.6569 3.5 21 4.84315 21 6.5Z"
														stroke="currentColor"
														strokeWidth="1.5"
													/>
													<path
														d="M9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12Z"
														stroke="currentColor"
														strokeWidth="1.5"
													/>
													<path
														d="M21 17.5C21 19.1569 19.6569 20.5 18 20.5C16.3431 20.5 15 19.1569 15 17.5C15 15.8431 16.3431 14.5 18 14.5C19.6569 14.5 21 15.8431 21 17.5Z"
														stroke="currentColor"
														strokeWidth="1.5"
													/>
													<path
														d="M8.72852 10.7495L15.2285 7.75M8.72852 13.25L15.2285 16.2495"
														stroke="currentColor"
														strokeWidth="1.5"
													/>
												</svg>
											</button>
										</div>
									</div>
								))
							) : (
								<>
									<h4 className="">No data found !!</h4>
								</>
							)}
						</div>
					</div>
				</Container>
			</div>
		</>
	);
};

export default Profile;
