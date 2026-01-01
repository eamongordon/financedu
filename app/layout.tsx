import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Financedu",
    default: "Financedu"
  },
  description: "We are Financedu - a non-profit empowering youth to live successful financial lives through comprehensive, fun, and engaging financial education courses and resources free of cost.",
};

const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!ga4MeasurementId) {
    console.warn("GA4_MEASUREMENT_ID is not set");
  }
  return (
    <html lang="en">
      <body
        className={`${lato.className} antialiased`}
      >
        <GoogleAnalytics gaId={ga4MeasurementId!} />
        <Script
          src="https://cdn.cookieless.tech/tracking.js"
          data-site-id="0092ceec-07a9-40ca-8998-7ae1205ce270"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
