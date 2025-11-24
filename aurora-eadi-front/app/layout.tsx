// Remova o 'use client' daqui!
import './globals.css'
import { Providers } from '../app/providers' // Importe o arquivo que criamos

export const metadata = {
  title: 'Sua App',
  description: 'Descrição da app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      {/* Dica Extra: Adicione suppressHydrationWarning no body 
         caso alguma extensão insira classes aqui. 
      */}
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}