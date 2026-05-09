"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
    id: number;
    slug: string;
    title: string;
    thumbnail: string | null;
    metaDescription: string | null;
    createdAt: string;
    category: { name: string };
    author: { name: string };
};

export default function PostGrid({
    initialPosts,
    initialHasMore,
    categorySlug,
}: {
    initialPosts: Post[];
    initialHasMore: boolean;
    categorySlug: string;
}) {
    const [posts, setPosts] = useState(initialPosts);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [page, setPage] = useState(2); // next page to fetch
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        setLoading(true);
        const res = await fetch(
            `/api/posts?category=${categorySlug}&page=${page}&limit=9`
        );
        const data = await res.json();
        setPosts((prev) => [...prev, ...data.data]);
        setHasMore(data.meta.hasMore);
        setPage((prev) => prev + 1);
        setLoading(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 divide-wired-black">
                {posts.map((post) => (
                    <article key={post.id} className="flex flex-col md:border-r border-wired-black last:border-r-0 md:px-6 first:pl-0 last:pr-0 pb-8 md:pb-0">
                        <Link href={`/${post.slug}`} className="group flex flex-col h-full">
                            <div className="relative w-full aspect-video mb-4">
                                <Image
                                    src={post.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                                />
                            </div>
                            <span className="font-mono text-[12px] font-bold text-wired-black uppercase tracking-[1.1px] mb-2">
                                {post.category.name}
                            </span>
                            <h2 className="font-display text-[26px] leading-[1.08] text-page-ink group-hover:text-link-blue transition-colors mb-3">
                                {post.title}
                            </h2>
                            <div className="mt-auto font-mono text-[11px] uppercase text-caption-gray tracking-[1.1px]">
                                BY {post.author.name} • {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-12 border-t border-wired-black pt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="h-14 px-12 bg-paper-white text-wired-black border-2 border-wired-black font-sans font-bold text-[16px] uppercase tracking-[0.3px] hover:bg-wired-black hover:text-paper-white transition-colors disabled:opacity-50 cursor-pointer rounded-none"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}
        </>
    );
}
