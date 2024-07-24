import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const middleware = (req) => {
	const token = req.cookies.get("token")?.value;
	console.log("🚀 ~ middleware ~ token:", token);
	const url = req.nextUrl;
	console.log("🚀 ~ middleware ~ url:", url);

	if (
		token &&
		(url.pathname.startsWith("/login") ||
			url.pathname.startsWith("/signup") ||
			url.pathname === "/")
	) {
		console.log("redirect to upload");
		return NextResponse.redirect(new URL("/upload", req.url));
	}

	if (
		!token &&
		(url.pathname.startsWith("/upload") || url.pathname.startsWith("/profile"))
	) {
		console.log("back to login");

		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
};

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/", "/login", "/signup", "/profile", "/upload"],
};
