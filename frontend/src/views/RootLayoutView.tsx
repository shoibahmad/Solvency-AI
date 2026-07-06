import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";

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
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { GlobalCommandMenu } from "@/components/ui/GlobalCommandMenu";
import { Footer } from "@/components/ui/Footer";

export function RootLayoutView({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col text-white relative" suppressHydrationWarning>
        
        <AmbientBackground />
        <GlobalCommandMenu />

        <AuthProvider>
          <ToastProvider>
            <GlobalLoader />
            <Header />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
