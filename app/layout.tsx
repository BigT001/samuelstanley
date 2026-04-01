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
  metadataBase: new URL('https://samuelstanley.com'),
  alternates: {
    canonical: '/',
  },
  title: "Samuel Stanley | Full Stack Developer in Lagos, Nigeria",
  description:
    "Samuel Stanley is an expert Full Stack Developer based in Lagos, Nigeria. Specializing in Next.js, Node.js, and scaling high-performance software. Available for engineering roles and bespoke freelance projects globally.",
  keywords: [
    "Samuel Stanley",
    "Full Stack Developer Lagos",
    "Software Engineer Nigeria",
    "Next.js Developer Lagos",
    "React Developer Nigeria",
    "Freelance Web Developer Lagos",
    "Node.js Expert Nigeria",
    "Samuel Stanley Portfolio",
    "Nigerian Software Developer",
    "Senior Full Stack Engineer Lagos"
  ],
  authors: [{ name: "Samuel Stanley" }],
  creator: "Samuel Stanley",
  publisher: "Samuel Stanley",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Samuel Stanley | Full Stack Developer - Lagos, Nigeria",
    description: "Expert software engineer building high-performance web and mobile applications with Next.js, NestJS, and Node.js. Based in Lagos.",
    type: "website",
    locale: "en_NG",
    url: "https://samuelstanley.com", // Assuming domain
    siteName: "Samuel Stanley Portfolio",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or placeholder
        width: 1200,
        height: 630,
        alt: "Samuel Stanley - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Samuel Stanley | Full Stack Developer",
    description: "Architecting robust systems and stunning interfaces in Lagos, Nigeria.",
    creator: "@samuelstanley", // Assuming handle
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Samuel Stanley",
    "jobTitle": "Full Stack Developer",
    "url": "https://samuelstanley.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lagos",
      "addressCountry": "Nigeria"
    },
    "description": "Samuel Stanley is a professional Full Stack Developer from Lagos, Nigeria, specializing in modern web architecture and UI/UX design.",
    "sameAs": [
      "https://www.linkedin.com/in/samuel-stanley-345174234/",
      "https://www.instagram.com/samuel.g.stanley"
    ],
    "knowsAbout": [
      "Full Stack Development",
      "Next.js",
      "NestJS",
      "Node.js",
      "React",
      "PostgreSQL",
      "Software Engineering",
      "Web Development",
      "API Design"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance / Open for Work"
    }
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#050810] text-[#f0f4ff]">{children}</body>
    </html>
  );
}
