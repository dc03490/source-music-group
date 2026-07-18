import type { MetadataRoute } from "next";
import { SITES } from "@source/ui";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["/", "/early-access", "/data-policy"].map((path) => ({
    url: path === "/" ? SITES.royalty.url : `${SITES.royalty.url}${path}`,
    lastModified,
  }));
}
