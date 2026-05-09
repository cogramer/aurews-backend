"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to login");
            }

            // Save token to localStorage for subsequent API requests
            localStorage.setItem("token", data.token);
            router.push("/write");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-[600px] mx-auto px-4 sm:px-8 py-20 flex flex-col items-center">
            <h1 className="font-display text-4xl mb-8">Sign In</h1>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
                {error && (
                    <div className="w-full p-4 border-2 border-[#e53e3e] text-[#e53e3e] font-sans font-bold">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 px-4 border-2 border-wired-black bg-paper-white font-sans text-[16px] outline-none focus:border-link-blue transition-colors rounded-none"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-sans font-bold text-[16px] uppercase tracking-wide">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-12 px-4 border-2 border-wired-black bg-paper-white font-sans text-[16px] outline-none focus:border-link-blue transition-colors rounded-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 mt-4 bg-paper-white text-wired-black border-2 border-wired-black font-sans font-bold text-[16px] tracking-[0.3px] hover:bg-wired-black hover:text-paper-white transition-colors uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>
            <p className="mt-8 text-page-ink">
                Don't have an account?{" "}
                <Link href="/register" className="font-sans font-bold text-[16px] uppercase tracking-wide text-link-blue hover:underline cursor-pointer">
                    Register
                </Link>
            </p>
        </main>
    );
}
