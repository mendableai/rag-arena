import Footer from "@/components/theme/footer";
import Header from "@/components/theme/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatbot Arena",
  description: "AI ChatBot Arena",
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
        <div className="content-grow">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
