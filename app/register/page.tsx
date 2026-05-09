"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Something went wrong");

            // Success! Redirect to login
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-paper-white flex flex-col items-center justify-center px-4 py-20">
            <div className="w-full max-w-[400px]">
                {/* Brand Logo / Link */}
                <Link href="/" className="font-display text-4xl block text-center mb-12 tracking-tighter hover:text-link-blue transition-colors">
                    AUREWS
                </Link>

                <div className="border-2 border-wired-black p-8 bg-white">
                    <h1 className="font-mono text-[14px] font-bold uppercase tracking-widest mb-8 border-b-2 border-wired-black pb-2">
                        Create Account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-error-red/10 border border-error-red p-3 text-error-red text-[13px] font-bold">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] uppercase font-bold tracking-wider">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full h-12 border-b-2 border-wired-black outline-none focus:border-link-blue transition-colors px-2"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] uppercase font-bold tracking-wider">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full h-12 border-b-2 border-wired-black outline-none focus:border-link-blue transition-colors px-2"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[11px] uppercase font-bold tracking-wider">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full h-12 border-b-2 border-wired-black outline-none focus:border-link-blue transition-colors px-2"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-wired-black text-paper-white font-sans font-bold uppercase tracking-wider hover:bg-link-blue transition-colors mt-4 disabled:opacity-50"
                        >
                            {loading ? "Creating Account..." : "Join Aurews"}
                        </button>
                    </form>

                    <p className="mt-8 text-center font-body text-[14px] text-caption-gray">
                        Already have an account?{" "}
                        <Link href="/login" className="text-wired-black font-bold underline decoration-1 underline-offset-4 hover:text-link-blue transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
