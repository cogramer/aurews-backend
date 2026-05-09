import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search | Aurews",
    description: "Search all stories on Aurews.",
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const { q, category } = await searchParams;
    const selectedCategory = category || "";
    const query = q?.trim() || "";

    let results: any[] = [];
    let error = "";

    if (query) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/search?q=${encodeURIComponent(query)}&limit=12${selectedCategory ? `&category=${encodeURIComponent(selectedCategory)}` : ""}`
                ,
                { cache: "no-store" }
            );
            const data = await res.json();
            results = data.hits || [];
        } catch {
            error = "Search is currently unavailable. Please try again.";
        }
    }

    return (
        <main className="w-full">
            {/* Search Header Ribbon */}
            <div className="w-full bg-wired-black text-paper-white px-4 sm:px-8 py-3">
                <div className="max-w-[1400px] mx-auto font-mono text-[13px] uppercase tracking-[1.2px] font-bold">
                    Search
                </div>
            </div>

            {/* Search Form */}
            <section className="max-w-[800px] mx-auto px-4 sm:px-8 py-10 border-b border-wired-black">
                <form method="GET" action="/search" className="flex gap-0">

                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Search stories..."
                        autoFocus
                        className="flex-1 h-14 px-4 border-2 border-wired-black border-r-0 font-sans text-[18px] outline-none focus:border-link-blue transition-colors rounded-none bg-paper-white"
                    />
                    <select
                        name="category"
                        defaultValue={selectedCategory}
                        className="h-14 px-4 border-2 border-l-0 border-wired-black font-sans uppercase text-[13px] tracking-wide outline-none rounded-none bg-paper-white cursor-pointer text-page-ink"
                    >
                        <option value="">All Categories</option>
                        <option value="Business News">Business</option>
                        <option value="Money &amp; Markets">Markets</option>
                        <option value="Tech &amp; Innovation">Tech</option>
                        <option value="A.I.">A.I.</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Politics">Politics</option>
                        <option value="Latest">Latest</option>
                    </select>

                    <button
                        type="submit"
                        className="h-14 px-8 bg-wired-black text-paper-white border-2 border-wired-black font-sans font-bold text-[14px] uppercase tracking-[0.3px] hover:bg-link-blue hover:border-link-blue transition-colors rounded-none cursor-pointer"
                    >
                        Search
                    </button>
                </form>
            </section>

            {/* Results */}
            <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10">
                {/* No query yet */}
                {!query && (
                    <p className="font-body text-lg text-caption-gray">
                        Enter a term above to search all stories.
                    </p>
                )}

                {/* Error state */}
                {error && (
                    <p className="font-mono text-[13px] uppercase tracking-[1.1px] text-[#e53e3e]">
                        {error}
                    </p>
                )}

                {/* No results */}
                {query && !error && results.length === 0 && (
                    <div className="border-t border-wired-black pt-8">
                        <p className="font-mono text-[13px] uppercase tracking-[1.1px] text-caption-gray mb-2">
                            0 Results for
                        </p>
                        <p className="font-display text-4xl text-page-ink">"{query}"</p>
                    </div>
                )}

                {/* Results grid */}
                {results.length > 0 && (
                    <>
                        <p className="font-mono text-[12px] uppercase tracking-[1.1px] text-caption-gray mb-8">
                            {results.length} results for "{query}"
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 divide-wired-black">
                            {results.map((post: any) => (
                                <article key={post.id} className="flex flex-col md:border-r border-wired-black last:border-r-0 md:px-6 first:pl-0 last:pr-0 pb-8 md:pb-0">
                                    <Link href={`/${post.slug}`} className="group flex flex-col h-full">
                                        {post.thumbnail && (
                                            <div className="relative w-full aspect-video mb-4">
                                                <Image
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                                                />
                                            </div>
                                        )}
                                        <span className="font-mono text-[12px] font-bold text-wired-black uppercase tracking-[1.1px] mb-2">
                                            {post.category}
                                        </span>
                                        <h2 className="font-display text-[26px] leading-[1.08] text-page-ink group-hover:text-link-blue transition-colors mb-3">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="font-body text-[15px] leading-normal text-page-ink mb-3 line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="mt-auto font-mono text-[11px] uppercase text-caption-gray tracking-[1.1px]">
                                            BY {post.author}
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}
