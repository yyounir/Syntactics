import type { Metadata } from "next";
import { Roboto, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { Sidebar } from "@/components/Sidebar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["700", "900"],
});

export const metadata: Metadata = {
  title: "Syntactics",
  description: "AI interview-prep tool for CS students practicing coding problems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${roboto.variable} ${sourceCodePro.variable}`}>
      <body>
        <ThemeProvider>
          <div className="app-background" aria-hidden="true" />
          <div className="app-shell">
            <Sidebar />
            <main className="app-main">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
