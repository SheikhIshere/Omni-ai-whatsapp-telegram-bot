/**
 * Root Application Layout
 * =======================
 * WHY: This is the entry point for all pages. It handles global fonts, 
 *      SEO metadata, and global stylesheet injection.
 * WHAT: Loads Google Fonts (Inter, Manrope) and initializes the 
 *       Material Symbols icon set.
 * HOW: Wraps all pages ({children}) in a global HTML/Body structure.
 */

import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

// --- FONT CONFIGURATION ---
// Inter: Primary body font for readability.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Manrope: Secondary/Headline font for modern aesthetic.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

// --- SEO & METADATA ---
export const metadata: Metadata = {
  title: "OmniAgent AI | Turn WhatsApp & Telegram into your best sales rep",
  description: "Automate lead qualification and appointment booking with enterprise-grade agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Why: Provides high-quality Google Material Icons across the entire app */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-body antialiased`}>
        {/* All children routes are rendered here */}
        {children}
      </body>
    </html>
  );
}
