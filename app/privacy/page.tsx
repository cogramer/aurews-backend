import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Learn how Aurews protects and handles your personal information.",
};

export default function PrivacyPage() {
    return (
        <main className="max-w-[800px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <span className="font-mono text-[13px] uppercase tracking-widest text-link-blue font-bold block mb-4">
                Legal Notice
            </span>
            <h1 className="font-display text-5xl sm:text-6xl text-wired-black mb-12">
                Privacy Policy
            </h1>

            <div className="font-body text-[18px] leading-[1.6] text-page-ink space-y-8">
                <section>
                    <h2 className="font-display text-2xl mb-4 text-wired-black border-b border-hairline pb-2">1. Information Collection</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, subscribe to our newsletter, or communicate with us. This may include your name, email address, and any other information you choose to provide.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl mb-4 text-wired-black border-b border-hairline pb-2">2. Use of Information</h2>
                    <p>
                        We use the information we collect to deliver the stories you love, improve our editorial platform, and send you technical notices, updates, and support messages.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl mb-4 text-wired-black border-b border-hairline pb-2">3. Cookies & Tracking</h2>
                    <p>
                        Aurews uses cookies to analyze site traffic and remember your preferences. You can control cookie settings through your browser, though some features may not function properly without them.
                    </p>
                </section>
            </div>
        </main>
    );
}
