import type { Metadata } from "next";
import { Playfair_Display, Lora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// WiredDisplay substitute
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-wired-display",
  weight: ["400", "700", "900"],
});

// BreveText substitute
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-breve-text",
  weight: ["400", "700"],
});

// Apercu substitute
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-apercu",
  weight: ["400", "600", "700"],
});

// WiredMono substitute
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-wired-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Aurews | Tech, Business & Innovation",
  description: "The latest news and features in technology, business, and innovation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans text-page-ink bg-paper-white antialiased min-h-screen flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
