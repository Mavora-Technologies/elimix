import { MetadataRoute } from "next";
import { headers } from "next/headers";

export const runtime = "edge";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "elimix.mavoratechnologies.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  ).replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/academics",
          "/attendance",
          "/communication",
          "/contact",
          "/exams",
          "/features",
          "/features/*",
          "/finance",
          "/pricing",
          "/privacy",
          "/students",
          "/terms",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/login",
          "/api/*",
          "/tenant/*",
          "/admin/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}