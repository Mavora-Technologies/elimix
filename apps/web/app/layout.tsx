import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { OrganizationAndWebsiteJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://elimix.mavoratechnologies.com"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Elimix School Management System in Kenya",
    template: "%s | Elimix School Management System",
  },
  description:
    "Manage school administration with Elimix. Connect student records, fees, attendance and academic operations in one school management platform.",
  keywords: [
    "school management system Kenya",
    "school management software Kenya",
    "school administration software",
    "student information management system",
    "CBC assessment management software",
    "school fees management system",
    "school attendance management system",
    "school examination management software",
    "Mavora Technologies",
  ],
  authors: [
    { name: "Mavora Technologies", url: "https://mavoratechnologies.com" },
  ],
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
    locale: "en_KE",
    url: siteUrl,
    title: "Elimix School Management System in Kenya",
    description:
      "Manage school administration with Elimix. Connect student records, fees, attendance and academic operations in one school management platform.",
    siteName: "Elimix School Management System",
    images: [
      {
        url: "/1.png",
        width: 1200,
        height: 630,
        alt: "Elimix School Management System Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elimix School Management System in Kenya",
    description:
      "Manage school administration with Elimix. Connect student records, fees, attendance and academic operations in one school management platform.",
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
        <OrganizationAndWebsiteJsonLd />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}