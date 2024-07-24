"use client";

import { z } from "zod";

const loginsValidationSchema = z.object({
	identifier: z.string().min(2).max(50),
	password: z.string().min(2).max(50),
});

export default loginsValidationSchema;
