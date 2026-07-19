import type { MetadataRoute } from "next";
import { SITES } from "@source/ui";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["/", "/artists/duka", "/submission-terms"].map((path) => ({
    url: path === "/" ? SITES.label.url : `${SITES.label.url}${path}`,
    lastModified,
  }));
}
