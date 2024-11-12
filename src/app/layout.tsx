import type { Metadata, Viewport } from "next";
import { Baloo_Paaji_2 } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const roboto = Baloo_Paaji_2({ subsets: ["latin"], weight: "500" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL || 'https://loom.com'),
  title: {
    default: "Loom",
    template: "%s | Loom"
  },
  description: "Join Loom, the social platform that weaves together ideas and stories. Connect with friends, share experiences, and build a vibrant community.",
  keywords: ["Loom", "social network", "connect", "share", "community", "storytelling", "ideas", "friends", "collaboration"],
  authors: [{ name: "Louis" }],
  creator: "Louis",
  publisher: "Loom Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Loom",
    title: "Loom - Weave Your Connections",
    description: "Experience a new way to connect and share on Loom. Join today!",
    images: [
      {
        url: "/loom.png",
        width: 1200,
        height: 630,
        alt: "Loom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loom - Weave Your Connections",
    description: "Join the community on Loom and share your stories.",
    site: "@Loom",
    creator: "@Loom",
    images: ["/loom.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
