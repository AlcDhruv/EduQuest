import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";  // ← Add this

export const metadata: Metadata = {
  title: "EduQuest - Learn Through Play",
  description: "Interactive educational gaming platform for middle school students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <AuthProvider>  {/* ← Wrap with this */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}