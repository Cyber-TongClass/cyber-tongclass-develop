import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/providers"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "通班官方网站 | Tong Class",
  description: "北京大学 & 清华大学 人工智能创新人才培养项目官方网站",
  keywords: ["人工智能", "通班", "PKU", "THU", "AI", "Machine Learning"],
  authors: [{ name: "Tong Class" }],
  openGraph: {
    title: "通班官方网站 | Tong Class",
    description: "北京大学 & 清华大学 人工智能创新人才培养项目官方网站",
    url: "https://tongclass.ac.cn",
    siteName: "Tong Class",
    locale: "zh_CN",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
