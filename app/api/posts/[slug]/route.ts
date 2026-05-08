import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { v2 as cloudinary } from 'cloudinary';
import meiliClient from "@/lib/meilisearch";
// ==============================
// 1. GET METHOD (Public)
// ==============================
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;

        if (!slug) return NextResponse.json({ error: 'Invalid post slug' }, { status: 400 });

        const post = await db.post.findUnique({
            where: { slug },
            include: {
                category: true,
                author: { select: { id: true, name: true, email: true, role: true } }
            }
        });

        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ==============================
// 2. PUT METHOD (Protected)
// ==============================
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const tokenUser = getUser(req);
        if (!tokenUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { slug } = await params;
        const body = await req.json();

        const existingPost = await db.post.findUnique({ where: { slug } });
        if (!existingPost) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        // Ownership / Admin check
        if (existingPost.authorId !== tokenUser.id && tokenUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedPost = await db.post.update({
            where: { slug },
            data: {
                title: body.title,
                content: body.content,
                metaDescription: body.metaDescription,
                thumbnail: body.thumbnail,
                categoryId: body.categoryId ? Number(body.categoryId) : undefined,
                status: body.status
            },
            include: {
                category: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
        try {
            await meiliClient.index('posts').addDocuments([{
                id: updatedPost.id,
                title: updatedPost.title,
                slug: updatedPost.slug,
                category: updatedPost.category.name,
                author: updatedPost.author.name,
                excerpt: updatedPost.content.substring(0, 200),
                status: updatedPost.status,
                thumbnail: updatedPost.thumbnail,
                createdAt: updatedPost.createdAt,
                updatedAt: updatedPost.updatedAt
            }]);
        } catch (err) {
            console.error('Failed to update Meilisearch:', err)
        }
        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// ==============================
// 3. DELETE METHOD (Protected)
// ==============================
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const tokenUser = getUser(req);
        if (!tokenUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { slug } = await params;

        const existingPost = await db.post.findUnique({ where: { slug }, select: { id: true, authorId: true, thumbnail: true } });
        if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        if (existingPost.authorId !== tokenUser.id && tokenUser.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden: You do not have permission to delete this post" }, { status: 403 });
        }
        if (existingPost.thumbnail && existingPost.thumbnail.includes('cloudinary.com')) {
            const urlParts = existingPost.thumbnail.split('/');
            const fileWithExtension = urlParts.slice(-2).join('/');
            const publicId = fileWithExtension.split('.')[0];
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error('Failed to delete image from Cloudinary', err);
            }
        }
        await db.post.delete({ where: { slug } });
        try {
            await meiliClient.index('posts').deleteDocument(existingPost.id)
        } catch (err) {
            console.error('Failed to delete from Meilisearch:', err)
        }
        return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post: ", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}