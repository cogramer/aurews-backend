import { db } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await db.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { createdAt: "desc" },
    });

    const postUrls = posts.map((post) => ({
        url: `https://aurews.id.vn/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const categoryUrls = [
        "latest", "business", "markets", "tech", "ai", "lifestyle", "politics"
    ].map((slug) => ({
        url: `https://aurews.id.vn/category/${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
    }));

    return [
        {
            url: "https://aurews.id.vn",
            lastModified: new Date(),
            changeFrequency: "hourly" as const,
            priority: 1.0,
        },
        {
            url: "https://aurews.id.vn/search",
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.3,
        },
        ...categoryUrls,
        ...postUrls,
    ];
}
