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
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const config = JSON.parse(localStorage.getItem('cybershield_theme_config') || '{"mode":"dark","accent":"amber"}');
                if (config.mode === 'dark' || (config.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else if (config.mode === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              } catch(e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#080B14] text-slate-100 min-h-screen antialiased selection:bg-amber-500 selection:text-white transition-colors duration-300 font-sans">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
