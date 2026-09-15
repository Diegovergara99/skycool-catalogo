import type { MetadataRoute } from "next";
import { entradasBlog } from "@/lib/blog";

const SITIO = "https://www.skycool.com.mx";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITIO,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITIO}/productos/ventilador-de-piso`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITIO}/productos/ventilador-de-techo-industrial`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITIO}/productos/extractor-de-aire`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITIO}/productos/ventilador-giratorio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITIO}/productos/enfriador-evaporativo`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITIO}/aviso-de-privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITIO}/blog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...entradasBlog.map((entrada) => ({
      url: `${SITIO}/blog/${entrada.slug}`,
      lastModified: new Date(entrada.fechaPublicacion),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
