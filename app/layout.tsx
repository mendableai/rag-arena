import LeftMenu from "@/components/theme/left-menu";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#8559F4",
          colorBackground: "#13191d",
          colorText: "#fff",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="manrope san html-body">
          <div className="content-grow px-4">
            <div className="grid w-full pl-[53px]">
              <LeftMenu />
              <div className="flex flex-col">{children}</div>
            </div>
          </div>
          <Analytics />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
