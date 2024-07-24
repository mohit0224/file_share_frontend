import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { DataProvider } from "@/context/dataContext";
import Header from "@/components/header/Header";

const inter = Ubuntu({
	subsets: ["latin"],
	weight: ["300", "400", "500", "700"],
});

export const metadata = {
	title: "File Share",
	description: "File sharing application",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<main>
					<DataProvider>
						{/* <Header /> */}
						{children}
						<Toaster richColors />
					</DataProvider>
				</main>
			</body>
		</html>
	);
}
