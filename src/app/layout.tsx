import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Toaster } from "react-hot-toast";
import "@rainbow-me/rainbowkit/styles.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Somnia Word Game",
  description: "Word puzzle game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
        <meta
          name="fc:frame"
          content='{
      "version": "1",
      "imageUrl": "https://png.pngtree.com/png-clipart/20230810/original/pngtree-word-game-rgb-color-icon-block-mind-web-vector-picture-image_10272348.png",
       "button": {
          "title": "Word Play",
          "action": {
            "type": "launch_frame",
            "name": "Somnia Word Play",
            "url": "https://word-puzzle-lemon.vercel.app/",
            "splashImageUrl": "https://png.pngtree.com/png-clipart/20230810/original/pngtree-word-game-rgb-color-icon-block-mind-web-vector-picture-image_10272348.png",
            "splashBackgroundColor": "#6c54f8"
          }
        }
     }'
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
