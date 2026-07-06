import type { Metadata } from "next";
import { RootLayoutView } from "@/views/RootLayoutView";

export const metadata: Metadata = {
  title: "Solvency AI",
  description: "A verdict on creditworthiness — issued in seconds, explained in plain language.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutView>{children}</RootLayoutView>;
}
