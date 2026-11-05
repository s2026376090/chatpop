import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/rooms", "/about", "/privacy", "/terms", "/guidelines", "/safety", "/contact"],
        disallow: ["/chat", "/admin"],
      },
    ],
    sitemap: "https://chatpop.example/sitemap.xml",
  };
}
