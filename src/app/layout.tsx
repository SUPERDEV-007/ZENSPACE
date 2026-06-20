import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "ZenSpace | Neo-Brutalist Mental Wellness",
  description: "A high-contrast, distraction-free mental wellness dashboard designed specifically to help high-stress students manage burnout and regain absolute focus.",
  keywords: "mental health, focus, pomodoro timer, student wellness, brutalism, ai journal, stress management",
  authors: [{ name: "ZenSpace Team" }],
  openGraph: {
    title: "ZenSpace",
    description: "Neo-Brutalist mental wellness for high-stress students.",
    url: "https://zenspace-app.netlify.app",
    siteName: "ZenSpace",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceMono.variable}`}>
      <body className="antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
