import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeToggle } from "./components/ThemeToggle";
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
  title: "Samuel Stanley | Full Stack Developer — Next.js, Node.js, React",
  description:
    "Samuel Stanley helps founders build and launch MVPs in 30 days. Specialized in Next.js, Node.js, and production-ready SaaS architecture. From idea to deployment, I handle it all.",
  keywords: [
    "Samuel Stanley",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "NestJS Developer",
    "SaaS Developer",
    "Freelance Full Stack Developer",
    "Remote Software Engineer",
    "Senior Full Stack Engineer",
    "PostgreSQL Developer",
    "TypeScript Developer",
    "Software Engineer for hire",
    "Full Stack Developer available for hire",
    "Samuel Stanley developer",
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
    title: "Samuel Stanley | Full Stack Developer — Next.js, Node.js, React",
    description: "Launch your MVP in 30 days. Specialist in building scalable SaaS, production-grade APIs, and stunning interfaces for founders.",
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
    description: "I help founders build and launch MVPs in 30 days. From idea to deployed product — backend, frontend, and infrastructure handled.",
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
    "description": "Samuel Stanley helps founders build and launch MVPs in 30 days. Specialist in Next.js, NestJS, Node.js, and SaaS architecture. Available globally for remote projects.",
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
      <body className="min-h-full flex flex-col bg-[#050810] text-[#f0f4ff]">
        <ThemeToggle />
        {children}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w5nkbmqo09");
          `}
        </Script>
      </body>
    </html>
  );
}
