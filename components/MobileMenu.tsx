"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
    { name: 'Home', href: '/' },
    { name: 'Latest', href: '/category/latest' },
    { name: 'Business News', href: '/category/business' },
    { name: 'Money & Markets', href: '/category/markets' },
    { name: 'Tech & Innovation', href: '/category/tech' },
    { name: 'A.I.', href: '/category/ai' },
    { name: 'Lifestyle', href: '/category/lifestyle' },
    { name: 'Politics', href: '/category/politics' },
];

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const check = () => setIsLoggedIn(!!localStorage.getItem("token"));
        check();
        window.addEventListener("storage", check);
        return () => window.removeEventListener("storage", check);
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setOpen(false);
        window.dispatchEvent(new Event("storage"));
        router.push("/");
    };

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                aria-expanded={open}
                className="flex flex-col justify-center gap-[4px] w-5 h-5 hover:opacity-70 transition-opacity"
            >
                {/* Animate the 3 bars into an X when open */}
                <span className={`block w-full h-[2px] bg-paper-white transition-transform duration-200 origin-center ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
                <span className={`block w-full h-[2px] bg-paper-white transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-[2px] bg-paper-white transition-transform duration-200 origin-center ${open ? 'translate-y-[6px] -rotate-45' : ''}`} />
            </button>

            {/* Drawer Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Drawer Panel */}
            <div className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-wired-black text-paper-white flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 h-12 border-b border-[#333]">
                    <span className="font-mono text-[12px] uppercase tracking-[1.2px] font-bold">Menu</span>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="text-paper-white hover:text-link-blue transition-colors text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Category Links */}
                <nav className="flex flex-col flex-1 overflow-y-auto py-4">
                    {categories.map((cat: any) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            onClick={() => setOpen(false)}
                            className="px-6 py-4 font-mono text-[13px] uppercase tracking-[1.1px] text-paper-white hover:text-link-blue border-b border-[#222] transition-colors"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* Bottom utility links */}
                <div className="border-t border-[#333] px-6 py-6 flex flex-col gap-4">
                    <Link href="/search" onClick={() => setOpen(false)} className="font-mono text-[12px] uppercase tracking-[1.2px] text-[#999] hover:text-link-blue transition-colors">
                        Search
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/write" onClick={() => setOpen(false)} className="font-mono text-[12px] uppercase tracking-[1.2px] text-[#999] hover:text-link-blue transition-colors">
                                Write
                            </Link>
                            <button
                                onClick={handleSignOut}
                                className="text-left font-mono text-[12px] uppercase tracking-[1.2px] text-[#999] hover:text-link-blue transition-colors cursor-pointer"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setOpen(false)} className="font-mono text-[12px] uppercase tracking-[1.2px] text-[#999] hover:text-link-blue transition-colors cursor-pointer">
                                Sign In
                            </Link>
                            <Link href="/register" onClick={() => setOpen(false)} className="font-mono text-[12px] uppercase tracking-[1.2px] text-[#999] hover:text-link-blue transition-colors cursor-pointer">
                                Register
                            </Link>
                        </>
                    )}
                    <Link href="https://www.facebook.com/profile.php?id=61589167535017" onClick={() => setOpen(false)} className="font-mono text-[12px] font-bold uppercase tracking-[1.2px] text-paper-white hover:text-link-blue transition-colors" target="_blank">
                        Subscribe
                    </Link>
                </div>

            </div>
        </>
    );
}
