import type { Metadata, Viewport } from "next";
import { Provider } from "react-redux";
import AuthProvider from "@/providers/authProvider";
import UiProvider from "@/providers/uiProvider";
import { NotificationContextProvider } from "@/context/notification";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { Urbanist } from "next/font/google";
import {
	ThirdwebProvider,
	metamaskWallet,
	coinbaseWallet,
	walletConnect,
	trustWallet,
} from "@thirdweb-dev/react";

import "@/styles/typography.scss";
import ExchangeRateProvider from "@/providers/exchangeRateProvider";

const inter = Urbanist({
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "700"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<body className={inter.className}>
				{/* <ThirdwebProvider
					supportedWallets={[
						metamaskWallet(),
						coinbaseWallet(),
						walletConnect(),
						trustWallet(),
					]}
					activeChain="mumbai"
					// authConfig={{
					//   domain: "http://localhost:3001",
					//   authUrl: "/api/auth/third-web"
					// }}
					clientId={process.env.NEXT_PUBLIC_THIRD_WEB_API}> */}
				<ReduxProvider>
					<AuthProvider>
						<ExchangeRateProvider>
							<UiProvider>
								<NotificationContextProvider>
									{children}
								</NotificationContextProvider>
							</UiProvider>
						</ExchangeRateProvider>
					</AuthProvider>
				</ReduxProvider>
				{/* </ThirdwebProvider> */}
			</body>
		</html>
	);
}

export const revalidate = 3600;

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: true,
	// Also supported by less commonly used
	// interactiveWidget: 'resizes-visual',
	// themeColor: [
	// 	{ media: "(prefers-color-scheme: light)", color: "cyan" },
	// 	{ media: "(prefers-color-scheme: dark)", color: "black" },
	// ],
	themeColor: "black",
};

export const metadata: Metadata = {
	generator: "Next.js",
	applicationName: "Top metro investment",
	referrer: "origin-when-cross-origin",
	keywords: [
		"Top Metro Investment",
		"Marketplace",
		"NFT",
		"Crypto",
		"Forex",
		"",
	],
	// authors: [{ name: "Seb" }, { name: "Josh", url: "https://nextjs.org" }],
	creator: "Top metro investment",
	publisher: "Top metro investment",
	metadataBase: new URL(process.env.VERCEL_URL!),
	// formatDetection: {
	//   email: false,
	// 	address: false,
	// 	telephone: false,
	// },
	manifest: `/manifest.json`,
	title:
		"Welcome to the global website for Top Metro Investment, the Crypto, Forex, and Commodities marketplace all in one Place. The first of its kind!!",
	description: "A blood donation management application",
	openGraph: {
		title:
			"Welcome to the global website for Top Metro Investment, the Crypto, Forex, and Commodities marketplace all in one Place. The first of its kind!!",
		description: "A blood donation management application",
		url: "/",
		siteName: "Top metro investment",
		images: [
			{
				url: "/icon.webp", // Must be an absolute URL
				width: 800,
				height: 600,
			},
			{
				url: "/icon.webp", // Must be an absolute URL
				width: 1800,
				height: 1600,
				alt: "My custom alt",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title:
			"Welcome to the global website for Top Metro Investment, the Crypto, Forex, and Commodities marketplace all in one Place. The first of its kind!!",
		description: "A blood donation management application",
		siteId: "1467726470533754880",
		creator: "@nextjs",
		creatorId: "1467726470533754880",
		images: ["/icon.webp"], // Must be an absolute URL
	},
};
