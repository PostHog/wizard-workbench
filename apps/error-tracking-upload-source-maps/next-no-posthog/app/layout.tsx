import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next App",
  description: "Test fixture without PostHog installed",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
