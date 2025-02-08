import { Providers } from './providers'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata = {
  title: 'Eco-Chat',
  description: 'Your eco-friendly AI chat assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}