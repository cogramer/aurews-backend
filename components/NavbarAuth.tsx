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
        <Link href="/login" className="font-mono text-[12px] uppercase tracking-[1.2px] hover:text-link-blue transition-colors max-sm:hidden">
            Sign In
        </Link>
    );
}