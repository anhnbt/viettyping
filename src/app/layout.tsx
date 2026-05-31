import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { SoundProvider } from '@/contexts/SoundContext'
import { StudentProvider } from '@/contexts/StudentContext'
import StudentConfigModal from '@/components/StudentConfigModal'

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
})

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
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        <SoundProvider>
          <StudentProvider>
            {children}
            <StudentConfigModal />
          </StudentProvider>
        </SoundProvider>
      </body>
    </html>
  )
}


