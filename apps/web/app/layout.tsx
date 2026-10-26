import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elimix.mavoratechnologies.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Elimix - Institutional Governance & School Management Platform",
    template: "%s | Elimix School Management System",
  },
  description:
    "Secure, multi-tenant administrative architecture for modern institutions, primary schools, and universities. Built by Mavora Technologies.",
  keywords: [
    "School management system in Kenya",
    "School management software",
    "Student information management system",
    "CBC assessment software",
    "School fees management system",
    "Multi-tenant institutional platform",
    "Mavora Technologies",
  ],
  authors: [{ name: "Mavora Technologies", url: "https://mavoratechnologies.com" }],
  creator: "Mavora Technologies",
  publisher: "Mavora Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Elimix - Institutional Governance & School Management Platform",
    description: "Secure, multi-tenant administrative architecture for modern institutions. Developed by Mavora Technologies.",
    siteName: "Elimix SRMS",
    images: [
      {
        url: "/1.png",
        width: 1200,
        height: 630,
        alt: "Elimix Institutional Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elimix - Institutional Governance & School Management Platform",
    description: "Secure, multi-tenant administrative architecture for modern institutions by Mavora Technologies.",
    images: ["/1.png"],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}