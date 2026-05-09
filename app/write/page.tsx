import { db } from "@/lib/db";
import CreatePostForm from "@/components/CreatePostForm";

export default async function CreatePostPage() {
    // Fetch categories to populate the select dropdown
    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <main className="w-full">
            {/* Header Ribbon */}
            <div className="w-full bg-wired-black text-paper-white px-4 sm:px-8 py-2">
                <div className="max-w-[800px] mx-auto font-mono text-[12px] uppercase tracking-[1.2px] font-bold">
                    Admin Dashboard // Create Post
                </div>
            </div>

            <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-12">
                <h1 className="font-display text-5xl mb-12">Publish New Story</h1>
                <CreatePostForm categories={categories} />
            </div>
        </main>
    );
}
