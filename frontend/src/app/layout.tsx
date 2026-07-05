import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-inter", // Keep variable name same so globals.css doesn't break
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
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-black text-white relative" suppressHydrationWarning>
        
        {/* Pure Black Background - No Ambient Lights or Grid */}

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
