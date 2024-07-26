module.exports = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
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
