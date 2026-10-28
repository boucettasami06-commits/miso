import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["500", "600", "700", "800"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Mijo — Menu de la semaine selon ton budget et ton objectif",
    template: "%s · Mijo",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "menu de la semaine",
    "menu semaine pas cher",
    "planificateur de repas",
    "liste de courses",
    "menu musculation",
    "menu healthy",
    "batch cooking",
    "idée repas",
    "repas petit budget",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: "Mijo — Ta semaine de repas, mijotée pour ton budget",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: "Mijo — Menu de la semaine selon ton budget", description: SITE.description },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fafaf5",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/icon`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE.url}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE.url}/recettes?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebApplication",
      name: SITE.name,
      url: SITE.url,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web, iOS, Android",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      description: SITE.description,
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="grain min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
