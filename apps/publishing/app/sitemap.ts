import type { MetadataRoute } from "next";
import { SITES } from "@source/ui";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["/"].map((path) => ({
    url: path === "/" ? SITES.publishing.url : `${SITES.publishing.url}${path}`,
    lastModified,
  }));
}
