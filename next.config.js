module.exports = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: `${process.env.BACKEND_URL}/:path*`,
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
