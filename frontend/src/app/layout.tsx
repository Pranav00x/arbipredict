import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Web3ModalProvider from "./providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArbiPredict - Arbitrum Prediction Market",
  description: "Bet HIGH or LOW on ETH price. Earn rewards on Arbitrum.",
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
        <Navbar />
        <main className="pt-24 pb-16 min-h-screen">
          {children}
        </main>
      </Web3ModalProvider>
    </body>
    </html >
  );
}
