"use client"; // Add this at the top to detect the active page
import { usePathname } from "next/navigation";
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import NavbarAuth from './NavbarAuth';

export default function Navbar() {
    const pathname = usePathname();

    const categories = [
        { name: 'Home', href: '/' },
        { name: 'Latest', href: '/category/latest' },
        { name: 'Business', href: '/category/business' },
        { name: 'Markets', href: '/category/markets' },
        { name: 'Tech', href: '/category/tech' },
        { name: 'A.I.', href: '/category/ai' },
        { name: 'Lifestyle', href: '/category/lifestyle' },
        { name: 'Politics', href: '/category/politics' }
    ];

    return (
        <header className="w-full bg-paper-white border-b border-wired-black">
            {/* Top Bar */}
            <div className="w-full bg-wired-black text-paper-white h-10 flex items-center justify-between px-4 sm:px-8">
                <div className="flex gap-6 items-center">
                    <MobileMenu />
                    <Link href="/search" className="font-mono text-[11px] uppercase tracking-widest hover:text-link-blue transition-colors max-sm:hidden">
                        Search
                    </Link>
                </div>
                <div className="flex gap-6 items-center">
                    <NavbarAuth />
                </div>
            </div>

            {/* Logo Area */}
            <div className="w-full flex flex-col items-center py-8 sm:py-10 border-b border-hairline">
                <Link href="/" className="font-display font-black text-6xl sm:text-8xl tracking-tighter text-wired-black uppercase leading-none">
                    AUREWS
                </Link>
            </div>

            {/* Categories Navigation */}
            <nav className="w-full bg-white border-wired-black">
                <ul className="flex items-center justify-center overflow-x-auto gap-1 sm:gap-2 px-2 no-scrollbar">
                    {categories.map((cat) => {
                        const isActive = pathname === cat.href;
                        return (
                            <li key={cat.name}>
                                <Link
                                    href={cat.href}
                                    className={`
                                        inline-block px-4 py-3 text-[12px] font-bold uppercase tracking-widest transition-all
                                        ${isActive
                                            ? 'bg-wired-black text-paper-white'
                                            : 'text-page-ink hover:bg-wired-black hover:text-paper-white'
                                        }
                                    `}
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
}
