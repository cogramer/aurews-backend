"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavbarAuth() {
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
        window.dispatchEvent(new Event("storage"));
        if (window.location.pathname === "/write") {
            window.location.href = "/";
        }
    };

    if (isLoggedIn) {
        return (
            <>
                <Link href="/write" className="font-mono text-[12px] uppercase tracking-[1.2px] hover:text-link-blue transition-colors max-sm:hidden">
                    Write
                </Link>
                <button
                    onClick={handleSignOut}
                    className="font-mono text-[12px] uppercase tracking-[1.2px] hover:text-link-blue transition-colors cursor-pointer max-sm:hidden"
                >
                    Sign Out
                </button>
            </>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link
                href="/login"
                className="font-mono text-[12px] uppercase tracking-[1.2px] hover:text-link-blue transition-colors cursor-pointer"
            >
                Sign In
            </Link>
            {/* ADD THIS REGISTER LINK */}
            <Link
                href="/register"
                className="font-mono text-[12px] uppercase tracking-[1.2px] border-2 border-wired-black px-3 py-1 hover:bg-wired-black hover:text-paper-white transition-colors cursor-pointer"
            >
                Join us
            </Link>
        </div>
    );
}