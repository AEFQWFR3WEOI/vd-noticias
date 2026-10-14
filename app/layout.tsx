import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DEFAULT_SHARE_IMAGE, PUBLISHER_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./lib/site-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VD Noticias | Visión Dominicana TV",
    template: "%s | VD Noticias",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Redacción VD Noticias", url: "/autores/redaccion-vd-noticias" }],
  creator: SITE_NAME,
  publisher: PUBLISHER_NAME,
  category: "news",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_DO",
    url: "/",
    siteName: SITE_NAME,
    title: "VD Noticias | Visión Dominicana TV",
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_SHARE_IMAGE, width: 1200, height: 630, alt: "VD Noticias" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VD Noticias | Visión Dominicana TV",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_SHARE_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/vd-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/vd-favicon.svg",
    apple: "/vd-noticias-logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#020b2d" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
