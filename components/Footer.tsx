import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    const sections = [
        {
            heading: "News",
            links: [
                { name: "Latest", href: "/category/latest" },
                { name: "Business News", href: "/category/business" },
                { name: "Money & Markets", href: "/category/markets" },
                { name: "Tech & Innovation", href: "/category/tech" },
            ],
        },
        {
            heading: "More",
            links: [
                { name: "A.I.", href: "/category/ai" },
                { name: "Lifestyle", href: "/category/lifestyle" },
                { name: "Politics", href: "/category/politics" },
                { name: "Search", href: "/search" },
            ],
        },
        {
            heading: "Company",
            links: [
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Newsletters", href: "/newsletter" },
                { name: "Subscribe", href: "https://www.facebook.com/profile.php?id=61589167535017" },
            ],
        },
    ];

    return (
        <footer className="w-full bg-page-ink text-paper-white mt-auto">
            {/* Newsletter Banner */}
            <div className="border-b border-[#333]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
                    <div>
                        <p className="font-mono text-[12px] uppercase tracking-[1.2px] font-bold text-paper-white mb-1">
                            Newsletter
                        </p>
                        <p className="font-body text-[15px] text-[#999] max-w-[400px]">
                            Get the best stories in tech, business and innovation delivered to your inbox.
                        </p>
                    </div>
                    <form className="flex w-full sm:w-auto gap-0 min-w-0 sm:min-w-[420px]">
                        <input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            className="flex-1 h-12 px-4 bg-page-ink border-2 border-paper-white border-r-0 font-sans text-[15px] text-paper-white placeholder:text-[#666] outline-none focus:border-link-blue transition-colors rounded-none"
                        />
                        <button
                            type="submit"
                            className="h-12 px-6 bg-paper-white text-wired-black border-2 border-paper-white font-sans font-bold text-[13px] uppercase tracking-[0.3px] hover:bg-link-blue hover:border-link-blue hover:text-paper-white transition-colors rounded-none cursor-pointer shrink-0"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer Grid */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12">
                {/* Logo */}
                <Link href="/" className="font-display font-black text-4xl sm:text-5xl tracking-tighter text-paper-white hover:text-link-blue transition-colors uppercase block mb-10">
                    AUREWS
                </Link>

                {/* Link columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-[#333] pt-10 mb-10">
                    {sections.map((section) => (
                        <div key={section.heading}>
                            <p className="font-mono text-[11px] uppercase tracking-[1.2px] font-bold text-[#666] mb-4">
                                {section.heading}
                            </p>
                            <ul className="flex flex-col gap-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="font-sans text-[13px] text-[#bbb] hover:text-link-blue transition-colors"
                                            target="_blank"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-[#333] pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="font-sans text-[12px] text-[#666]">
                        © {year} Aurews. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="font-sans text-[12px] text-[#666] hover:text-link-blue transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="font-sans text-[12px] text-[#666] hover:text-link-blue transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
