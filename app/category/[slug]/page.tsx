
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PostGrid from "@/components/PostGrid";
export const revalidate = 3600; // Cache for 1 hour
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/posts?category=${slug}&limit=1`,
        { cache: "force-cache" }
    );
    const data = await res.json();
    if (!data.data || data.data.length === 0) return { title: "Not Found | Aurews" };
    const categoryName = data.data[0].category.name;
    return {
        title: `${categoryName} | Aurews`,
        description: `Latest stories in ${categoryName} from Aurews.`,
    };
}

export default async function CategoryPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/posts?category=${slug}&limit=9&page=1`,
        { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const posts = data.data;
    if (!posts || posts.length === 0) notFound();
    const hasMore = data.meta.hasMore;
    const categoryName = posts[0].category.name;


    return (
        <main className="w-full">
            {/* Category Ribbon */}
            <div className="w-full bg-wired-black text-paper-white px-4 sm:px-8 py-3">
                <div className="max-w-[1400px] mx-auto font-mono text-[13px] uppercase tracking-[1.2px] font-bold">
                    {categoryName}
                </div>
            </div>

            {/* Post Grid */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10">
                {posts.length === 0 ? (
                    <p className="font-body text-lg text-caption-gray">No stories in this category yet.</p>
                ) : (
                    <PostGrid
                        initialPosts={posts}
                        initialHasMore={hasMore}
                        categorySlug={slug}
                    />
                )}
            </section>
        </main>
    );
}
