"use client";

import { z } from "zod";

const signupValidationSchema = z.object({
	username: z.string().min(2).max(50),
	email: z.string().email(),
	name: z.string().min(2).max(50),
	password: z.string().min(2).max(50),
});

export default signupValidationSchema;
