import { MetadataRoute } from "next";
import { headers } from "next/headers";

export const runtime = "edge";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const host = headersList.get("host") || "elimix.mavoratechnologies.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  ).replace(/\/$/, "");

  const publicRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/features", changeFrequency: "monthly", priority: 0.9 },
    {
      path: "/features/cbc-assessment",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      path: "/features/fees-management",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
    { path: "/academics", changeFrequency: "monthly", priority: 0.8 },
    { path: "/finance", changeFrequency: "monthly", priority: 0.8 },
    { path: "/students", changeFrequency: "monthly", priority: 0.8 },
    { path: "/attendance", changeFrequency: "monthly", priority: 0.8 },
    { path: "/exams", changeFrequency: "monthly", priority: 0.8 },
    { path: "/communication", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}