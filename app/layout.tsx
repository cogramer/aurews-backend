import type { Metadata } from "next";
import { Playfair_Display, Lora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Aurews — Tech, Business & Innovation News",
    template: "%s | Aurews",   // any page that sets title="Article Title" becomes "Article Title | Aurews"
  },
  description: "Aurews covers the latest in technology, business, artificial intelligence, markets, and lifestyle. Stay informed with in-depth reporting.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://aurews.id.vn"), // your production domain
  openGraph: {
    siteName: "Aurews",
    type: "website",
    locale: "en_US",
    url: "https://aurews.id.vn",
    title: "Aurews — Tech, Business & Innovation News",
    description: "...",
    images: [
      {
        url: "https://res.cloudinary.com/docpflk0p/image/upload/v1778279272/aures_thumbnails/ptf5iqkxvv9dyeeiysjb.jpg",
        width: 1200,
        height: 630,
        alt: "Aurews — Tech, Business & Innovation News",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aurews",
    title: "Aurews — Tech, Business & Innovation News",
    description: "...",
    images: ["https://res.cloudinary.com/docpflk0p/image/upload/v1778279272/aures_thumbnails/ptf5iqkxvv9dyeeiysjb.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

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
