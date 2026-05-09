import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Aurews team for tips, feedback, or business inquiries.",
};

export default function ContactPage() {
    return (
        <main className="max-w-[800px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <span className="font-mono text-[13px] uppercase tracking-widest text-link-blue font-bold block mb-4">
                Get in Touch
            </span>
            <h1 className="font-display text-5xl sm:text-7xl text-wired-black mb-12">
                Contact Us.
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h3 className="font-mono text-[12px] uppercase tracking-widest font-bold mb-2">Editorial Inquiries</h3>
                        <p className="font-body text-page-ink">tips@aurews.id.vn</p>
                    </div>
                    <div>
                        <h3 className="font-mono text-[12px] uppercase tracking-widest font-bold mb-2">Advertising</h3>
                        <p className="font-body text-page-ink">ads@aurews.id.vn</p>
                    </div>
                    <div>
                        <h3 className="font-mono text-[12px] uppercase tracking-widest font-bold mb-2">Social</h3>
                        <Link href="https://www.facebook.com/profile.php?id=61589167535017" className="font-body text-page-ink hover:text-link-blue cursor-pointer transition-colors underline decoration-1 underline-offset-4" target="_blank" rel="noopener noreferrer">Facebook</Link>

                    </div>
                </div>

                {/* Simple Form Placeholder */}
                <form className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] uppercase font-bold">Name</label>
                        <input type="text" className="w-full h-12 border-b-2 border-wired-black outline-none focus:border-link-blue transition-colors bg-transparent" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] uppercase font-bold">Email</label>
                        <input type="email" className="w-full h-12 border-b-2 border-wired-black outline-none focus:border-link-blue transition-colors bg-transparent" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] uppercase font-bold">Message</label>
                        <textarea className="w-full h-32 border-b-2 border-wired-black outline-none focus:border-link-blue transition-colors bg-transparent resize-none" />
                    </div>
                    <button className="h-14 bg-wired-black text-paper-white font-sans font-bold uppercase tracking-wider hover:bg-link-blue transition-colors mt-4">
                        Send Message
                    </button>
                </form>
            </div>
        </main>
    );
}
