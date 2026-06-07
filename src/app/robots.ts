import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ruangusahakita.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/creator/",
        "/umkm/",
        "/callback",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
