import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getUser(req);
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // 🔒 Now this is safe! 
        // It only returns the user's posts, and it never interferes with the homepage.
        let where: any = { authorId: user.id };

        // If you want admins to see everything in their dashboard:
        if (user.role === 'ADMIN') {
            where = {};
        }

        const posts = await db.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });

        return NextResponse.json({ data: posts });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
    }
}
