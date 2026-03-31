import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Samuel Stanley — Full Stack Developer",
  description:
    "Samuel Stanley is a full-stack developer who architects robust systems, crafts stunning interfaces, and ships production-grade software. Available for freelance & full-time roles.",
  keywords: ["full stack developer", "web developer", "Samuel Stanley", "Next.js", "React", "Node.js"],
  authors: [{ name: "Samuel Stanley" }],
  openGraph: {
    title: "Samuel Stanley — Full Stack Developer",
    description: "Full-stack developer who actually ships things.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050810] text-[#f0f4ff]">{children}</body>
    </html>
  );
}
