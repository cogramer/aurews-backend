import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "404 — Page Not Found",
    description: "The page you are looking for does not exist.",
};

export default function NotFound() {
    return (
        <main className="max-w-[800px] mx-auto px-4 sm:px-8 py-24 flex flex-col items-center text-center">
            {/* 404 Number */}
            <span className="font-display text-[120px] sm:text-[180px] leading-none text-hairline select-none mb-0">
                404
            </span>

            {/* Mono kicker */}
            <span className="font-mono text-[13px] uppercase tracking-[1.1px] font-bold text-wired-black mb-4">
                Page Not Found
            </span>

            {/* Message */}
            <p className="font-body text-[18px] leading-normal text-caption-gray mb-10 max-w-[480px]">
                The story you're looking for has moved, been removed, or never existed. Try searching instead.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="h-12 px-8 bg-wired-black text-paper-white border-2 border-wired-black font-sans font-bold text-[14px] uppercase tracking-[0.3px] hover:bg-link-blue hover:border-link-blue transition-colors flex items-center justify-center"
                >
                    Back to Homepage
                </Link>
                <Link
                    href="/search"
                    className="h-12 px-8 bg-paper-white text-wired-black border-2 border-wired-black font-sans font-bold text-[14px] uppercase tracking-[0.3px] hover:bg-wired-black hover:text-paper-white transition-colors flex items-center justify-center"
                >
                    Search Stories
                </Link>
            </div>
        </main>
    );
}
