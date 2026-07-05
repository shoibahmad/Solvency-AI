import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/lib/AuthContext";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { Header } from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Solvency AI",
  description: "A verdict on creditworthiness — issued in seconds, explained in plain language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-[#09090b]">
        <AuthProvider>
          <ToastProvider>
            <GlobalLoader />
            <Header />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
