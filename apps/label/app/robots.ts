import type { MetadataRoute } from "next";
import { SITES } from "@source/ui";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITES.label.url}/sitemap.xml`,
  };
}
