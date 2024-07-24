import Header from "@/components/header/Header";

export const metadata = {
	title: "File Share",
	description: "File sharing application",
};

export default function RootLayout({ children }) {
	return (
		<div>
			<Header />
			{children}
		</div>
	);
}
