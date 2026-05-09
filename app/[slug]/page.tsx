import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Metadata } from "next";
export const revalidate = 3600; // revalidate every hour

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    const post = await db.post.findUnique({
        where: { slug },
        include: {
            category: true,
            author: {
                select: { name: true }
            }
        }
    });

    if (!post) {
        return { title: "Page not found", description: "The page you are looking for does not exist" }
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aurews.id.vn";
    return {
        title: post.title,
        description: post.metaDescription || undefined,
        alternates: {
            canonical: `${baseUrl}/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.metaDescription || undefined,

            images: post.thumbnail ? [{ url: post.thumbnail }] : [],
            type: "article",
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author.name]
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.metaDescription ?? undefined,
            images: post.thumbnail ? [post.thumbnail] : [],
        },
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const post = await db.post.findUnique({
        where: { slug },
        include: {
            category: true,
            author: { select: { name: true } }
        }
    });

    if (!post) {
        notFound();
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aurews.id.vn";
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": post.title,
        "description": post.metaDescription,
        "image": [post.thumbnail || ""],
        "datePublished": post.createdAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": [{
            "@type": "Person",
            "name": post.author.name,
            "url": `${baseUrl}/author/${post.author.name}` // Placeholder link
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Aurews",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png` // Make sure you have a logo.png in public/
            }
        }
    };
    return (
        <main className="w-full bg-paper-white min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header / Kicker Section */}
            <header className="max-w-[800px] mx-auto px-4 sm:px-0 pt-12 sm:pt-16 text-center">
                <span className="font-mono text-[13px] font-bold text-wired-black uppercase tracking-[0.92px] mb-4 block">
                    {post.category.name}
                </span>
                <h1 className="font-display text-4xl sm:text-[64px] leading-[0.93] tracking-[-0.5px] text-page-ink mb-6">
                    {post.title}
                </h1>
                {post.metaDescription && (
                    <p className="font-body text-xl sm:text-[19px] leading-[1.47] text-page-ink mb-8 max-w-[600px] mx-auto text-center italic">
                        {post.metaDescription}
                    </p>
                )}

                {/* Bylines */}
                <div className="border-y border-hairline py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 font-mono text-[12px] uppercase text-caption-gray tracking-[1.1px]">
                    <span className="text-wired-black font-bold">BY {post.author.name}</span>
                    <span className="hidden sm:inline">•</span>
                    <time dateTime={post.createdAt.toISOString()}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                    </time>
                </div>
            </header>

            {/* Hero Image */}
            {post.thumbnail && (
                <div className="max-w-[1100px] mx-auto px-4 sm:px-0 my-10">
                    <div className="relative w-full aspect-video">
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 1100px) 100vw, 1100px"
                        />
                    </div>
                </div>
            )}

            {/* Article Content */}
            <article className="max-w-[700px] mx-auto px-4 sm:px-0">
                <div
                    className="font-body text-[16px] sm:text-[18px] leading-[1.6] text-page-ink whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            {/* Footer Rule */}
            <div className="max-w-[800px] mx-auto px-4 sm:px-0 mt-20">
                <div className="border-t-2 border-wired-black w-full"></div>
            </div>
        </main>
    );
}
