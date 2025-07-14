import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toast } from "@/components/toast"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AuraVerse - Free Content Sharing Platform",
  description: "Share and download Minecraft content, plugins, and more - completely free",
  generator: "v0.dev"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* ✅ Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <AuthProvider>
          {children}
          <Toast />
        </AuthProvider>

        {/* ✅ Linkvertise Script (external JS + inline init) */}
        <Script
          src="https://publisher.linkvertise.com/cdn/linkvertise.js"
          strategy="afterInteractive"
        />
        <Script id="linkvertise-init" strategy="afterInteractive">
          {`
            linkvertise(1371134, {
              whitelist: ["test-domain-nine.vercel.app"],
              blacklist: []
            });
          `}
        </Script>
      </body>
    </html>
  )
}
