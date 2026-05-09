import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Aurews",
    description: "The mission and history behind the Aurews news platform.",
};

export default function AboutPage() {
    return (
        <main className="max-w-[800px] mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <span className="font-mono text-[13px] uppercase tracking-widest text-link-blue font-bold block mb-4">
                Our Mission
            </span>
            <h1 className="font-display text-5xl sm:text-7xl text-wired-black mb-12">
                ABOUT AUREWS
            </h1>

            <p className="font-display text-2xl sm:text-3xl text-page-ink leading-tight mb-12 border-l-4 border-wired-black pl-6">
                Accurate, independent, nonpartisan journalism that advances the power of facts.
            </p>

            <div className="font-body text-[18px] leading-[1.6] text-page-ink space-y-8">
                <p>
                    <strong>AUREWS</strong> is a modern news platform developed by a
                    dedicated team of <strong>UIT students</strong> as part of their web development
                    capstone project.
                </p>

                <div className="bg-paper-white border-2 border-wired-black p-8 my-10">
                    <h2 className="font-mono text-[12px] uppercase font-bold tracking-widest mb-4">The Name</h2>
                    <p className="italic">
                        The name "AUREWS" draws inspiration from "aureus," symbolizing our
                        commitment to delivering golden, valuable content to our readers.
                        Just as aureus represents something precious and enduring,
                        <strong> AUREWS</strong> aims to be your trusted source for quality
                        journalism and insightful news coverage.
                    </p>
                </div>

                <p>
                    Our platform combines cutting-edge web technology with a passion for
                    storytelling, creating an intuitive and engaging reading experience
                    that keeps you informed about the world around you.
                </p>

                <div className="pt-12 border-t border-hairline flex flex-col gap-4">
                    <h3 className="font-mono text-[12px] uppercase tracking-widest font-bold">Follow Our Progress</h3>
                    <div className="flex gap-6">
                        {/* You can add real social links here later */}
                        <span className="font-body text-link-blue hover:underline cursor-pointer">Facebook</span>
                        <span className="font-body text-link-blue hover:underline cursor-pointer">Instagram</span>
                        <span className="font-body text-link-blue hover:underline cursor-pointer">X (Twitter)</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
