import type { Metadata } from "next";
import { PostHogProvider } from "./providers";

export const metadata: Metadata = {
  title: "Next App",
  description: "Test fixture for PostHog source maps prompt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
