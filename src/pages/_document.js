import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


export default function Document() {
  return (
    <Html lang="es" className="h-full">
      <Head>
        <link rel="icon" href={process.env.NEXT_PUBLIC_FAVICON || "/favicon.ico"} />
        <link href="https://rsms.me/inter/inter.css" rel="stylesheet" />


      </Head>
      <body className="h-full bg-background">

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
