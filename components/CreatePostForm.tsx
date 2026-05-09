"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreatePostForm({ categories }: { categories: any[] }) {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        }
    }, [router])
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
    const [status, setStatus] = useState("PUBLISHED");

    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Enforce WebP or AVIF
        if (file.type !== "image/webp" && file.type !== "image/avif") {
            setError("Only WebP and AVIF images are allowed for SEO optimization.");
            return;
        }

        setError("");
        setImageFile(file);
        // Strategy 1: Local Preview (URL.createObjectURL) - No API call yet
        setImagePreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Not authenticated. Please login first.");

            let thumbnailUrl = "";

            // Strategy 1 - Step A: Upload image first if one was selected
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);

                const uploadRes = await fetch("/api/media", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadData.error || "Failed to upload image");

                thumbnailUrl = uploadData.url;
            }

            // Generate slug from title
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            // Strategy 1 - Step C: Create the post with the returned URL
            const postRes = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    slug,
                    content,
                    metaDescription,
                    categoryId: parseInt(categoryId as string),
                    status,
                    thumbnail: thumbnailUrl
                })
            });

            const postData = await postRes.json();
            if (!postRes.ok) throw new Error(postData.error || "Failed to create post");

            setSuccess("Post created successfully!");
            // Redirect to home after short delay
            setTimeout(() => {
                router.push("/");
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
            {error && (
                <div className="w-full p-4 border-2 border-error-red text-error-red font-sans font-bold">
                    {error}
                </div>
            )}
            {success && (
                <div className="w-full p-4 border-2 border-link-blue text-link-blue font-sans font-bold">
                    {success}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Headline (H1)</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full h-14 px-4 border-2 border-wired-black font-display text-2xl outline-none focus:border-link-blue rounded-none"
                    placeholder="Enter the main headline..."
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Excerpt (Deck)</label>
                <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full p-4 border-2 border-wired-black font-body text-lg outline-none focus:border-link-blue rounded-none resize-y min-h-[100px]"
                    placeholder="A short summary of the article..."
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Category</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full h-12 px-4 border-2 border-wired-black font-sans uppercase text-[14px] outline-none focus:border-link-blue rounded-none bg-white cursor-pointer"
                    >
                        {categories.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-12 px-4 border-2 border-wired-black font-sans uppercase text-[14px] outline-none focus:border-link-blue rounded-none bg-white cursor-pointer"
                    >
                        <option value="PUBLISHED">Published</option>
                        <option value="DRAFT">Draft</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-wired-black pt-6">
                <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Cover Image (WebP/AVIF)</label>
                <input
                    type="file"
                    accept="image/webp, image/avif"
                    onChange={handleImageChange}
                    className="w-full font-sans text-[14px] cursor-pointer file:border-2 file:border-wired-black file:bg-paper-white file:px-4 file:py-2 file:font-bold file:uppercase file:cursor-pointer hover:file:bg-wired-black hover:file:text-paper-white file:transition-colors file:mr-4 file:rounded-none"
                />
                {imagePreviewUrl && (
                    <div className="mt-4 relative w-full aspect-video border-2 border-wired-black">
                        <Image
                            src={imagePreviewUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 800px) 100vw, 800px"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 border-t border-wired-black pt-6">
                <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Article Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full p-4 border-2 border-wired-black font-body text-[16px] outline-none focus:border-link-blue rounded-none resize-y min-h-[300px]"
                    placeholder="Write the full article content here..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full h-16 mt-4 bg-paper-white text-wired-black border-2 border-wired-black font-sans font-bold text-[18px] tracking-[0.3px] hover:bg-wired-black hover:text-paper-white transition-colors uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
            >
                {loading ? "Publishing..." : "Publish Article"}
            </button>
        </form>
    );
}
