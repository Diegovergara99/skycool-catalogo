import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/pago/"],
    },
    sitemap: "https://www.skycool.com.mx/sitemap.xml",
  };
}
