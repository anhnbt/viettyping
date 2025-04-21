import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Luyện Gõ Phím Tiếng Việt',
  description: 'Ứng dụng luyện gõ phím tiếng Việt với nhiều cấp độ từ cơ bản đến nâng cao',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
