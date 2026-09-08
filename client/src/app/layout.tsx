import type { Metadata } from "next"
import "./globals.css"
import { Nunito, DM_Sans, Inter } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import { ConditionalNavbar } from "@/components/ConditionalNavbar"

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Metsie — Competitive Learning Platform",
  description: "Answer questions in Math, Science, and CS before the clock runs out. Compete, rank up, and master your subjects.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased dark ${nunito.variable} ${dmSans.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-violet-500 selection:text-white font-sans">
        <AuthProvider>
          <ConditionalNavbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
