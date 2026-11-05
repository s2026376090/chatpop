import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://chatpop.example";
  const pages = ["", "/rooms", "/about", "/privacy", "/terms", "/guidelines", "/cookies", "/safety", "/contact"];
  return pages.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date("2026-01-01"),
  }));
}
