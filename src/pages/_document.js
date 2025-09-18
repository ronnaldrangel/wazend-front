import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


export default function Document() {
  return (
    <Html lang="es" className="h-full">
      <Head>
        {/* Meta tags básicos para SEO */}
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#059669" />
        <meta name="msapplication-TileColor" content="#059669" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Favicons y iconos */}
        <link rel="icon" href={process.env.NEXT_PUBLIC_FAVICON || "/favicon.ico"} />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/images/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Fuentes optimizadas */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />
        
        {/* DNS prefetch para recursos externos */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.clarity.ms" />
        
        {/* Meta tags de seguridad */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
      </Head>
      <body className="h-full bg-background">

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
