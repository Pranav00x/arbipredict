import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Web3ModalProvider from "./providers";
import { Navbar } from "@/components/Navbar";
import { FarcasterSDKInit } from "@/components/FarcasterSDKInit";

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arbipredict.vercel.app";

export const metadata: Metadata = {
  title: "ArbiPredict - Arbitrum Prediction Market",
  description: "Bet HIGH or LOW on ETH price. Earn rewards on Arbitrum.",
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      name: "ArbiPredict",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Play Now",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#0a0a0a",
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white min-h-screen`}>
        <Web3ModalProvider>
          <FarcasterSDKInit />
          <Navbar />
          <main className="pt-24 pb-16 min-h-screen">
            {children}
          </main>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
