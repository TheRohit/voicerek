import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Providers from "~/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "VoiceRek - Your Friend",
  description: "Your AI Friend!!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const TopNav = () => {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold ">
      <div>VoiceRek</div>
    </nav>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={`font-sans ${inter.variable}`}>
          <div className="grid h-screen grid-rows-[auto,1fr]">
            <TopNav />
            <main className="overflow-y-scroll">{children}</main>
          </div>
        </body>
      </Providers>
    </html>
  );
}
