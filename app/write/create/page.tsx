import { db } from "@/lib/db";
import CreatePostForm from "@/components/CreatePostForm";
import Link from "next/link";

async function CreatePostPage() {
    const categories = await db.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <main className="w-full bg-paper-white min-h-screen">
            <div className="w-full bg-wired-black text-paper-white px-4 sm:px-8 py-2">
                <div className="max-w-[800px] mx-auto font-mono text-[12px] uppercase tracking-[1.2px]">
                    <Link href="/" className="hover:text-link-blue transition-colors">Home</Link>
                    <span className="mx-2 opacity-50">/</span>
                    <Link href="/write" className="hover:text-link-blue transition-colors">Dashboard</Link>
                    <span className="mx-2 opacity-50">/</span>
                    <span className="font-bold">New Story</span>
                </div>
            </div>

            <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-12">
                <header className="mb-12">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-link-blue font-bold">Drafting</span>
                    <h1 className="font-display text-5xl text-wired-black mt-2">Publish New Story</h1>
                </header>
                <CreatePostForm categories={categories} />
            </div>
        </main>
    );
}

export default CreatePostPage;
