"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import loginsValidationSchema from "@/validation/loginValidation";
import Link from "next/link";
import authServices from "@/services/userApiServices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useData } from "@/context/dataContext";

const Login = () => {
	const navigate = useRouter();
	const { getUserFnc } = useData();

	const form = useForm({
		resolver: zodResolver(loginsValidationSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	const onSubmit = async (data) => {
		try {
			const response = authServices.loginUser(data);

			toast.promise(response, {
				loading: "Please wait for the login...",
				success: (res) => res.data.message,
				error: (err) => err?.response.data.message,
			});

			await response;
			navigate.replace("/upload");
			getUserFnc();
			navigate.refresh();
		} catch (err) {}
	};

	return (
		<>
			<div className="lg:flex h-svh">
				<div className="bg-[url('/bg.webp')] bg-cover bg-no-repeat bg-center hidden lg:block h-full w-1/2"></div>

				<div className=" h-full lg:w-1/2 lg:flex items-center justify-center ">
					<div className="bg-white relative w-10/12 lg:w-8/12 p-5 lg:p-10 rounded-xl shadow-lg mx-auto lg:mx-0 mt-20 lg:mt-0 space-y-5">
						<div className="absolute top-5 left-5">
							<Link href={"/"} className="flex gap-3 items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width="24"
									height="24"
									fill="none"
									className="text-slate-950"
								>
									<path
										d="M3.99982 11.9998L19.9998 11.9998"
										stroke="currentColor"
										stroke-Width="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M8.99963 17C8.99963 17 3.99968 13.3176 3.99966 12C3.99965 10.6824 8.99966 7 8.99966 7"
										stroke="currentColor"
										stroke-Width="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</Link>
						</div>
						<h1 className="text-3xl font-semibold text-center">File Share</h1>

						<div className="flex">
							<Link
								className="flex-1 border-b-2 border-slate-950 text-slate-950 text-center py-3"
								href={"/login"}
							>
								Log in
							</Link>
							<Link
								className="flex-1 border-b-2 border-slate-200 text-slate-600 text-center py-3"
								href={"/signup"}
							>
								Create account
							</Link>
						</div>

						<div>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-5"
								>
									<FormField
										control={form.control}
										name="identifier"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username / Email</FormLabel>
												<FormControl>
													<Input placeholder="Username / Email" {...field} />
												</FormControl>
												<FormMessage className="text-[12px]" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="Password"
														{...field}
													/>
												</FormControl>
												<FormMessage className="text-[12px]" />
											</FormItem>
										)}
									/>
									<Button className="w-full" type="submit">
										Login
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
