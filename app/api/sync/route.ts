import { db } from "@/lib/db";
import meiliClient from "@/lib/meilisearch";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allPosts = await db.post.findMany({
            include: {
                category: true,
                author: true
            }
        })
        if (!allPosts) {
            return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
        }
        const formattedPosts = allPosts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category.name,
            author: post.author.name,
            excerpt: post.content.substring(0, 200),
            status: post.status,
            thumbnail: post.thumbnail,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));
        if (formattedPosts.length > 0) {
            await meiliClient.index('posts').updateFilterableAttributes(['status', 'category']);
            await meiliClient.index('posts').updateSearchableAttributes([
                'title',      // Priority 1
                'excerpt',    // Priority 2
                'category',   // Priority 3
                'author'      // Priority 4
            ]);
            await meiliClient.index('posts').updateSortableAttributes(['createdAt', 'updatedAt', 'title'])
            await meiliClient.index('posts').addDocuments(formattedPosts);
        }

        return NextResponse.json({
            message: 'Success!',
            syncedCount: formattedPosts.length
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}