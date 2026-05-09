import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

export default async function Home() {
  // Fetch all data in parallel for performance
  const [heroPosts, latestPosts, aiPosts, popularPosts] = await Promise.all([
    // Hero + 3-col grid (4 posts)
    db.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { category: true, author: { select: { name: true } } }
    }),
    // Latest section — 5 text-only headlines
    db.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 9,
      skip: 4, // skip the ones already shown above
      include: { category: true }
    }),
    // A.I. section — 4 posts
    db.post.findMany({
      where: { status: 'PUBLISHED', category: { slug: 'ai' } },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { category: true }
    }),
    // Most Popular — 5 posts (using createdAt as proxy for now)
    db.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true }
    }),
  ]);

  if (heroPosts.length === 0) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
        <h1 className="font-display text-4xl">No stories available.</h1>
      </main>
    );
  }

  const [heroPost, ...gridPosts] = heroPosts;


  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12 border-b border-wired-black">
        <article className="flex flex-col">
          {/* Image */}
          <Link href={`/${heroPost.slug}`} className="group w-full block">
            <div className="relative w-full aspect-video mb-6">
              <Image
                src={heroPost.thumbnail || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"}
                alt={heroPost.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </div>

            {/* Meta / Kicker */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[13px] font-bold text-wired-black uppercase tracking-[1.1px]">
                {heroPost.category.name}
              </span>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-[64px] font-normal leading-[0.93] tracking-[-0.5px] text-page-ink group-hover:text-link-blue transition-colors">
                {heroPost.title}
              </h1>

              {/* Excerpt / Deck */}
              {heroPost.metaDescription && (
                <p className="font-body text-lg sm:text-[19px] leading-[1.47] text-page-ink mt-3 max-w-[800px]">
                  {heroPost.metaDescription}
                </p>
              )}

              {/* Author / Timestamp */}
              <div className="font-mono text-[12px] uppercase text-caption-gray tracking-[1.1px] mt-4">
                BY {heroPost.author.name} • {new Date(heroPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </Link>
        </article>
      </section>

      {/* Grid Section */}
      {gridPosts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12 border-b border-wired-black">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-wired-black">
            {gridPosts.map((post: any, idx: number) => (
              <article key={post.id} className={`flex flex-col md:px-6 ${idx === 0 ? 'md:pl-0' : ''} ${idx === gridPosts.length - 1 ? 'md:pr-0' : ''}`}>
                <Link href={`/${post.slug}`} className="group h-full flex flex-col">
                  <div className="relative w-full aspect-4/3 mb-4">
                    <Image
                      src={post.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    />
                  </div>
                  <span className="font-mono text-[12px] font-bold text-wired-black uppercase tracking-[1.1px] mb-2">
                    {post.category.name}
                  </span>
                  <h3 className="font-display text-[26px] leading-[1.08] text-page-ink group-hover:text-link-blue transition-colors mb-3">
                    {post.title}
                  </h3>
                  {post.metaDescription && (
                    <p className="font-body text-[16px] leading-normal text-page-ink mb-4 line-clamp-2">
                      {post.metaDescription}
                    </p>
                  )}
                  <div className="mt-auto font-mono text-[11px] uppercase text-caption-gray tracking-[1.1px]">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

      )}
      {/* ── LATEST Section ────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 border-b border-wired-black">
        {/* Ribbon */}
        <div className="w-full bg-wired-black text-paper-white py-2 px-0 mb-6">
          <span className="font-mono text-[12px] font-bold uppercase tracking-[1.2px] px-4">Latest</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x md:divide-wired-black pb-8">
          {latestPosts.map((post: any, idx: number) => (
            <article key={post.id} className={`flex flex-col md:px-6 py-4 border-b border-wired-black md:border-b-0 ${idx === 0 ? 'md:pl-0' : ''} ${idx === latestPosts.length - 1 ? 'md:pr-0' : ''}`}>
              <Link href={`/${post.slug}`} className="group">
                <span className="font-mono text-[11px] font-bold text-wired-black uppercase tracking-[1.1px] mb-1 block">
                  {post.category.name}
                </span>
                <h3 className="font-display text-[22px] leading-[1.12] text-page-ink group-hover:text-link-blue transition-colors">
                  {post.title}
                </h3>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── A.I. Feature Section ───────────────────── */}
      {aiPosts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-8 border-b border-wired-black">
          {/* Ribbon */}
          <div className="w-full bg-wired-black text-paper-white py-2 px-0 mb-6">
            <span className="font-mono text-[12px] font-bold uppercase tracking-[1.2px] px-4">A.I.</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x md:divide-wired-black pb-8">
            {/* Big Feature Left */}
            <article className="md:pr-8 pb-6 md:pb-0">
              <Link href={`/${aiPosts[0].slug}`} className="group flex flex-col">
                <div className="relative w-full aspect-video mb-4">
                  <Image
                    src={aiPosts[0].thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop"}
                    alt={aiPosts[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <span className="font-mono text-[12px] font-bold text-wired-black uppercase tracking-[1.1px] mb-2">A.I.</span>
                <h2 className="font-display text-[36px] leading-[1.05] text-page-ink group-hover:text-link-blue transition-colors">
                  {aiPosts[0].title}
                </h2>
              </Link>
            </article>
            {/* 3 Small Posts Right */}
            <div className="flex flex-col divide-y divide-wired-black md:pl-8">
              {aiPosts.slice(1).map((post: any) => (
                <article key={post.id} className="py-4 first:pt-0 last:pb-0">
                  <Link href={`/${post.slug}`} className="group flex gap-4">
                    <div className="relative w-24 h-16 shrink-0">
                      <Image
                        src={post.thumbnail || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <h3 className="font-display text-[18px] leading-[1.15] text-page-ink group-hover:text-link-blue transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MOST POPULAR Section ───────────────────── */}
      {popularPosts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-8 border-b border-wired-black">
          {/* Ribbon */}
          <div className="w-full bg-wired-black text-paper-white py-2 px-0 mb-6">
            <span className="font-mono text-[12px] font-bold uppercase tracking-[1.2px] px-4">Most Popular</span>
          </div>
          <div className="flex flex-col divide-y divide-wired-black pb-8">
            {popularPosts.map((post: any, idx: number) => (
              <article key={post.id} className="flex gap-6 items-start py-5 first:pt-0">
                <span className="font-display text-[48px] leading-none text-hairline shrink-0 w-12 text-center">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <Link href={`/${post.slug}`} className="group flex-1">
                  <span className="font-mono text-[11px] font-bold text-wired-black uppercase tracking-[1.1px] mb-1 block">
                    {post.category.name}
                  </span>
                  <h3 className="font-display text-[22px] leading-[1.1] text-page-ink group-hover:text-link-blue transition-colors">
                    {post.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
