import type { Metadata } from "next";
import { DM_Mono, Syne } from "next/font/google";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Nav } from "@/components/Nav";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.simpsonlite.com"),
  title: "Lucas Simpson",
  description:
    "Building companies, creating content, and figuring it out — from Rome.",
  icons: {
    icon: [
      {
        url: "/logos/website%20favi.png",
        type: "image/png",
      },
    ],
    /** Aligns with app/icon.png (kept in sync with public asset). */
    apple: "/logos/website%20favi.png",
  },
  openGraph: {
    description:
      "Building companies, creating content, and figuring it out — from Rome.",
    images: [
      {
        url: "/logos/website%20favi.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Fallback if the compiled CSS chunk fails to load (extensions / cache / dev watcher). */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { background-color: #080808; }
              body { margin: 0; min-height: 100vh; background-color: #080808; color: #f0ede8; }
            `,
          }}
        />
      </head>
      <body
        className={`${syne.variable} ${dmMono.variable} min-h-screen bg-bg antialiased`}
      >
        <GrainOverlay />
        <Nav />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
