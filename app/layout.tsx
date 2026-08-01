import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import CustomCursor from "@/components/CustomCursor";
import MobileStickyCart from "@/components/MobileStickyCart";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CORE. - technical, high-performance hair care",
  description:
    "CORE. is a stealth, engineered hair care brand. technical, high-performance formulas refined for scalp and strand perfection.",
  metadataBase: new URL("https://bycore.eu"),
  openGraph: {
    title: "CORE. - technical, high-performance hair care",
    description: "CORE. is a stealth, engineered hair care brand. technical, high-performance formulas refined for scalp and strand perfection.",
    url: "https://bycore.eu",
    siteName: "CORE.",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CORE. - technical, high-performance hair care",
    description: "CORE. is a stealth, engineered hair care brand. technical, high-performance formulas refined for scalp and strand perfection.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-white selection:bg-white/20 selection:text-white">
        <Providers>
          <div className="hidden md:block">
            <CustomCursor />
          </div>
          {/* Global slide-out cart drawer — present on every page */}
          <CartDrawer />
          <MobileStickyCart />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
