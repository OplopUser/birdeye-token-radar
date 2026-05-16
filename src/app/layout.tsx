import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Birdeye Token Radar",
  description: "Track Solana token movement with Birdeye market data, security checks, and momentum scoring.",
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
