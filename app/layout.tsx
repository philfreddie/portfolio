import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newRelicScript = (() => {
  try {
    const scriptPath = path.join(process.cwd(), "newrelic.md");
    const raw = fs.readFileSync(scriptPath, "utf8");
    return raw
      .replace(/^<script[^>]*>/i, "")
      .replace(/<\/script>\s*$/i, "")
      .trim();
  } catch (error) {
    console.warn("New Relic script missing or unreadable:", error);
    return "";
  }
})();

export const metadata: Metadata = {
  title: "freddiephilpot.dev",
  description: "My Portfolio Website",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {newRelicScript && (
          <Script
            id="newrelic-browser-agent"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: newRelicScript }}
          />
        )}
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
