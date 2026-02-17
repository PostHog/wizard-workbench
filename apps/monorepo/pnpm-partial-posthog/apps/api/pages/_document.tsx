import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html
      lang="en"
      className="bg-white dark:bg-gray-950 text-black dark:text-white"
    >
      <Head />
      <body className="min-h-[100dvh] bg-gray-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
