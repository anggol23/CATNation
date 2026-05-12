import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CATNation | Platform Tryout CPNS & BUMN #1",
  description: "Platform simulasi tryout online CPNS, BUMN, Kedinasan, dan PPPK. Rasakan sistem CAT asli dengan ranking nasional dan analisa kelemahan.",
  keywords: "contoh soal CPNS, passing grade CPNS, latihan TIU gratis, tryout CPNS, tryout BUMN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background selection:bg-primary/30 selection:text-primary">
        {/* State-of-the-art Background Blobs */}
        <div className="mesh-blob bg-primary animate-float top-[-10%] left-[-10%]" />
        <div className="mesh-blob bg-accent animate-float top-[20%] right-[-10%] [animation-delay:2s]" />
        <div className="mesh-blob bg-secondary animate-float bottom-[-10%] left-[20%] [animation-delay:4s]" />
        
        <div className="flex flex-col min-h-screen relative z-10">
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
