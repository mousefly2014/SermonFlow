import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SermonFlow",
  description: "AI-powered YouTube sermon script builder for Christian creators"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
