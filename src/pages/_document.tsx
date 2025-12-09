import Document, { Html, Head, Main, NextScript } from "next/document"
import { JSX } from "react"

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html className="min-h-full" lang="en" data-theme="light">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="image.png" type="image/png" sizes="any" />
          {/* <link rel="icon" href="/companylogo.png" type="image/png" /> */}
          {/* <meta name="theme-color" content="#004aad" /> */}
        </Head>

        <body className="min-h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
export default MyDocument
