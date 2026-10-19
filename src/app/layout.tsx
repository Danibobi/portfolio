import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { preload } from "react-dom";
import { recordImageSources } from "@/data/records";
import { INTRO_SESSION_KEY } from "@/lib/intro";
import "./globals.css";

const introFallback = Manrope({
  subsets: ["latin"],
  variable: "--font-intro-fallback",
  display: "block",
});

const introBootstrapScript = `(function(){try{document.documentElement.dataset.introState=sessionStorage.getItem(${JSON.stringify(INTRO_SESSION_KEY)})==='1'?'seen':'active'}catch(error){document.documentElement.dataset.introState='active'}})();`;

export const metadata: Metadata = {
  title: "Daniel Gal — A Life in Seven Records",
  description: "An interactive archive of Daniel Gal's education, projects, work, and ideas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  recordImageSources.forEach((src) => {
    preload(src, { as: "image", type: "image/svg+xml" });
  });

  return (
    <html
      lang="en"
      className={introFallback.variable}
      suppressHydrationWarning
    >
      <head>
        <script id="intro-session-bootstrap" dangerouslySetInnerHTML={{ __html: introBootstrapScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
