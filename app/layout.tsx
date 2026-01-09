import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Life Calendar Wallpaper",
  description: "Generate beautiful year-progress wallpapers for your phone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0B0F14" }}>
        {children}
      </body>
    </html>
  );
}
