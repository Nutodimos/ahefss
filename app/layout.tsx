import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Association of Home Economics and Food Science Students",
  description: "Official digital portal and legacy archive for the Association of Home Economics and Food Science Students (AHEFSS). Exploring executive cabinets, events, projects, and academic sessions.",
  applicationName: "Association of Home Economics and Food Science Students",
  keywords: ["AHEFSS", "Home Economics", "Food Science", "Elevation Era", "Archival Platform", "University Association", "Association of Home Economics and Food Science Students"],
  openGraph: {
    title: "Association of Home Economics and Food Science Students",
    siteName: "Association of Home Economics and Food Science Students",
    description: "Official digital portal and legacy archive for the Association of Home Economics and Food Science Students (AHEFSS). Exploring executive cabinets, events, projects, and academic sessions.",
  },
  icons: {
    icon: [
      { url: "/icon.jpg", type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.jpg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth h-full antialiased overflow-x-hidden w-full max-w-full">
      <head>
        <link rel="icon" href="/icon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/icon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FDFDF8] text-[#1A1A1A] overflow-x-hidden w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
