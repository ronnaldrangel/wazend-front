import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


export default function Document() {
  return (
    <Html lang="es" className="h-full">
      <Head>
        <link rel="icon" href={process.env.NEXT_PUBLIC_FAVICON || "/favicon.ico"} />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />

        <Script src="/assets/lang-config.js" strategy="beforeInteractive" />
        <Script src="/assets/translation.js" strategy="beforeInteractive" />
        <Script src="https://translate.google.com/translate_a/element.js?cb=TranslateInit" strategy="afterInteractive" />
      </Head>
      <body className="h-full bg-background">
        <div id="google_translate_element"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
