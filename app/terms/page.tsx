import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "The legal terms and conditions for using the Aurews platform.",
};

export default function TermsPage() {
    return (
        <main className="max-w-[800px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <span className="font-mono text-[13px] uppercase tracking-widest text-link-blue font-bold block mb-4">
                Usage Agreement
            </span>
            <h1 className="font-display text-5xl sm:text-6xl text-wired-black mb-12">
                Terms of Service
            </h1>

            <div className="font-body text-[18px] leading-[1.6] text-page-ink space-y-8">
                <section>
                    <h2 className="font-display text-2xl mb-4 text-wired-black border-b border-hairline pb-2">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using Aurews, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl mb-4 text-wired-black border-b border-hairline pb-2">2. Content Ownership</h2>
                    <p>
                        All content published on Aurews, including text, graphics, and logos, is the property of Aurews or our content suppliers and is protected by international copyright laws.
                    </p>
                </section>

                <section>
                    <h2 className="font-display text-2xl mb-4 text-wired-black border-b border-hairline pb-2">3. User Conduct</h2>
                    <p>
                        Users are prohibited from using the site for any unlawful purpose or to transmit any material that is defamatory, offensive, or otherwise objectionable.
                    </p>
                </section>
            </div>
        </main>
    );
}
