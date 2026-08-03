import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import CustomCursor from "@/components/layout/CustomCursor";
import MobileStickyCart from "@/components/cart/MobileStickyCart";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/layout/Footer";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D0D0D",
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
      <body className="min-h-full flex flex-col bg-[#0D0D0D] text-white selection:bg-white/20 selection:text-white overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CORE.",
              url: "https://bycore.eu",
              logo: "https://bycore.eu/CORE_logo_trans.png",
              description: "technical, high-performance hair care",
              sameAs: [
                "https://instagram.com/bycore.eu",
                "https://twitter.com/bycore_eu"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CORE.",
              url: "https://bycore.eu"
            })
          }}
        />
        <Providers>
          <CustomCursor />
          <CartDrawer />
          <MobileStickyCart />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
