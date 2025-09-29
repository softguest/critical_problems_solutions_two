import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Providers from "@/components/Providers";
import FloatingChat from "@/components/FloatChat/FloatingChat"; // new import
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Critical Problems and Solutions",
  description: "AI-powered business solutions platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            {children}
            <FloatingChat />
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
