module.exports = {
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: "https://file-share-backend-phi.vercel.app/:path*",
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
			},
		],
	},
};
