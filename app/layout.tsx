import type { Metadata } from "next";
import { Poppins, Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { AOSProvider } from "@/src/providers/AOSProvider";
import LoadingScreen from "@/src/components/common/LoadingScreen";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Topo",
  description: "Premium aluminum window solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Toaster position="top-right" reverseOrder={false} />
        <LoadingScreen />
        <AOSProvider>
          {children}
        </AOSProvider>
      </body>
    </html>
  );
}