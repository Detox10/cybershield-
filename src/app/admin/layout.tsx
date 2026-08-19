import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Console — CyberShield Sentinel OS",
  description: "Role-based admin control panel for CyberShield security platform.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080A0F] text-white antialiased">
      {children}
    </div>
  );
}
