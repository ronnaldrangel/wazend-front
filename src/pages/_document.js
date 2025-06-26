import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="es" className="h-full">
      <Head>
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />

        <Script src="/assets/lang-config.js" strategy="beforeInteractive" />
        <Script src="/assets/translation.js" strategy="beforeInteractive" />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=TranslateInit"
          strategy="afterInteractive"
        />

        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      </Head>
      <body className="h-full bg-gray-100">
        <div id="google_translate_element"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
