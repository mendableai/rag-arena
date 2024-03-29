import DocumentPopUp from "@/components/theme/document-pop-up";
import Footer from "@/components/theme/footer";
import Header from "@/components/theme/header";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAG Arena",
  description: "Evaluate Retreivers with RAG Arena",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="manrope san html-body">
        <Header />
        <div className="content-grow px-4">{children}</div>
        <Analytics />
        <Footer />
        <DocumentPopUp />
        <Toaster />
      </body>
    </html>
  );
}
