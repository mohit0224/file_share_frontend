import { NextResponse } from "next/server";

export const middleware = (req) => {
	const token = req.cookies.get("token")?.value;
	const url = req.nextUrl;

	if (
		token &&
		(url.pathname.startsWith("/login") ||
			url.pathname.startsWith("/signup") ||
			url.pathname === "/")
	) {
		return NextResponse.redirect(new URL("/upload", req.url));
	}

	if (
		!token &&
		(url.pathname.startsWith("/upload") || url.pathname.startsWith("/profile"))
	) {
		return NextResponse.redirect(new URL("/login", req.url));
	}

	return NextResponse.next();
};

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/", "/login", "/signup", "/profile", "/upload"],
};
