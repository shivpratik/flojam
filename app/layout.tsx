import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider, themeScript } from "@/components/ThemeProvider";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FloJam — collaborative diagrams",
  description:
    "Create a room, share the code, and build flowcharts together in real time.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
