import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberShield — Next-Gen AI Cybersecurity OS",
  description:
    "Next-generation AI-powered cybersecurity operating system with continuous zero-trust protection, deep binary disassembly, and autonomous mitigation.",
  keywords: [
    "cybersecurity",
    "threat intelligence",
    "zero-trust",
    "cyber shield",
    "autonomous security",
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-[#080B14] text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-sky-500 selection:text-white transition-colors duration-300 font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
