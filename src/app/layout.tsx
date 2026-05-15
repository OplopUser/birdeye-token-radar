import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Birdeye Sprint Radar",
  description: "Discover new & trending Solana tokens with transparent safety + momentum scoring. Built for Birdeye BIP Sprint 4.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
