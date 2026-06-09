import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"
import Header  from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuildAi - Build your AI App in Seconds",
  description: "BuildAi is a powerful platform that allows you to create AI applications quickly and easily. With our intuitive interface and robust features, you can bring your AI ideas to life in no time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html
      lang="en" suppressHydrationWarning >
      <body className={cn("min-h-full flex flex-col", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
