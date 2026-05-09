"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Types for our data
type User = { id: number; name: string; email: string; role: string };
type Post = { id: number; title: string; slug: string; status: string; category: { name: string }; createdAt: string };

export default function WriteDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
            return;
        }

        // Fetch user info and posts from your existing API
        async function loadDashboard() {
            try {
                const [userRes, postsRes] = await Promise.all([
                    fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("/api/posts?limit=50", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (!userRes.ok) throw new Error("Unauthorized");

                const userData = await userRes.json();
                const postsData = await postsRes.json();

                setUser(userData);
                setPosts(postsData.data || []);
            } catch (err) {
                localStorage.removeItem("token");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, [router]);

    if (loading) return (
        <div className="max-w-[1000px] mx-auto p-12 font-mono text-[13px] uppercase tracking-widest text-caption-gray">
            Loading Dashboard...
        </div>
    );

    return (
        <main className="w-full min-h-screen bg-paper-white">
            {/* Breadcrumb Ribbon */}
            <div className="w-full bg-wired-black text-paper-white px-4 sm:px-8 py-2">
                <div className="max-w-[1000px] mx-auto font-mono text-[12px] uppercase tracking-[1.2px]">
                    <Link href="/" className="hover:text-link-blue transition-colors">Home</Link>
                    <span className="mx-2 opacity-50">/</span>
                    <span className="font-bold">Dashboard</span>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-12">
                {/* User Profile Header */}
                <div className="border-2 border-wired-black p-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-caption-gray">Writer Profile</span>
                        <h1 className="font-display text-4xl text-wired-black mt-1">{user?.name}</h1>
                        <p className="font-mono text-[12px] text-caption-gray mt-1">{user?.email}</p>
                    </div>
                    <Link
                        href="/write/create"
                        className="bg-wired-black text-paper-white px-8 py-3 font-sans font-bold text-[14px] uppercase tracking-wider hover:bg-link-blue transition-colors"
                    >
                        + Create New Story
                    </Link>
                </div>

                {/* Stories List */}
                <h2 className="font-mono text-[14px] font-bold uppercase tracking-widest border-b-2 border-wired-black pb-2 mb-6">
                    Your Stories ({posts.length})
                </h2>

                <div className="flex flex-col divide-y divide-hairline">
                    {posts.length === 0 ? (
                        <p className="py-12 text-center font-body text-caption-gray italic">
                            You haven't published any stories yet.
                        </p>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="py-6 flex justify-between items-center group">
                                <div className="flex-1">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-link-blue">
                                        {post.category.name}
                                    </span>
                                    <h3 className="font-display text-xl group-hover:text-link-blue transition-colors mt-1">
                                        <Link href={`/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <span className="font-mono text-[11px] text-caption-gray mt-2 block">
                                        {new Date(post.createdAt).toLocaleDateString()} — {post.status}
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <Link href={`/write/edit/${post.slug}`} className="font-mono text-[11px] uppercase border-b border-transparent hover:border-wired-black transition-all">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
