import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "goBlink Connect — Universal Multi-Chain Wallet SDK",
  description:
    "One provider. One hook. 9 blockchain ecosystems. 350+ wallets. Replace nested providers with a single <goBlink ConnectProvider>. Tree-shakeable, TypeScript-first, MIT licensed.",
  keywords: [
    "wallet connect",
    "multi-chain",
    "web3",
    "EVM",
    "Solana",
    "Bitcoin",
    "React",
    "SDK",
    "goBlink Connect",
    "goblink",
  ],
  openGraph: {
    title: "goBlink Connect — Universal Multi-Chain Wallet SDK",
    description:
      "One provider. One hook. 9 blockchain ecosystems. 350+ wallets.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50`}
      >
        {children}
      </body>
    </html>
  );
}
