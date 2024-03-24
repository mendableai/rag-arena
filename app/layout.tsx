import LeftMenu from "@/components/theme/left-menu";
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
        <div className="content-grow px-4">
          <div className="grid min-h-[calc(100vh-7.0rem)] w-full pl-[53px]">
            <LeftMenu />
            <div className="flex flex-col">{children}</div>
          </div>
        </div>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
