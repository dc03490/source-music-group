import type { MetadataRoute } from "next";
import { SITES } from "@source/ui";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["/", "/about", "/contact", "/privacy", "/terms"].map((path) => ({
    url: path === "/" ? SITES.source.url : `${SITES.source.url}${path}`,
    lastModified,
  }));
}
