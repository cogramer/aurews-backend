import Link from 'next/link';

export default function Navbar() {
    const categories = [
        { name: 'Home', href: '/' },
        { name: 'Latest', href: '/category/latest' },
        { name: 'Business News', href: '/category/business' },
        { name: 'Money & Markets', href: '/category/markets' },
        { name: 'Tech & Innovation', href: '/category/tech' },
        { name: 'A.I.', href: '/category/ai' },
        { name: 'Lifestyle', href: '/category/lifestyle' },
        { name: 'Politics', href: '/category/politics' }
    ];

    return (
        <header className="w-full font-sans bg-paper-white border-b border-hairline">
            {/* Top Utility Bar (Black) */}
            <div className="w-full bg-wired-black text-paper-white h-10 flex items-center justify-between px-4 sm:px-8">
                <div className="flex gap-6 items-center">
                    {/* Hamburger Icon */}
                    <button className="flex flex-col justify-center gap-[3px] w-5 h-4 hover:opacity-70 transition-opacity">
                        <span className="block w-full h-[2px] bg-paper-white"></span>
                        <span className="block w-full h-[2px] bg-paper-white"></span>
                        <span className="block w-full h-[2px] bg-paper-white"></span>
                    </button>
                    <Link href="/search" className="font-mono text-[12px] uppercase tracking-[1.2px] hover:text-link-blue transition-colors max-sm:hidden">
                        Search
                    </Link>
                </div>

                <div className="flex gap-6 items-center">
                    <Link href="/newsletter" className="font-mono text-[12px] uppercase tracking-[1.2px] hover:text-link-blue transition-colors max-sm:hidden">
                        Newsletters
                    </Link>
                    <Link href="/subscribe" className="font-mono text-[12px] font-bold uppercase tracking-[1.2px] hover:text-link-blue transition-colors">
                        Subscribe
                    </Link>
                    <Link href="/login" className="font-mono text-[12px] uppercase tracking-[1.2px] hover:text-link-blue transition-colors max-sm:hidden">
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Main Header / Logo Area */}
            <div className="w-full border-b-2 border-wired-black">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col items-center">
                    <Link href="/" className="font-display font-black text-5xl sm:text-7xl tracking-tighter hover:text-link-blue transition-colors text-wired-black uppercase">
                        AUREWS
                    </Link>
                </div>

                {/* Navigation Categories */}
                <nav className="max-w-[1400px] mx-auto px-4 sm:px-8 border-t border-wired-black">
                    <ul className="flex justify-center overflow-x-auto gap-6 sm:gap-10 py-3 scrollbar-hide">
                        {categories.map((cat) => (
                            <li key={cat.name} className="shrink-0">
                                <Link
                                    href={cat.href}
                                    className="inline-block text-[14px] sm:text-[15px] font-bold text-page-ink hover:text-link-blue transition-colors"
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
