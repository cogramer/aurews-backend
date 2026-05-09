import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://aurews.id.vn";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",       // don't index API routes
                    "/write/",     // don't index the write dashboard
                    "/login",      // don't index login page
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
