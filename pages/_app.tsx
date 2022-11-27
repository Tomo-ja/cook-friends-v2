import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CookiesProvider } from 'react-cookie'
import { StyledLayout } from '../components'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <StyledLayout>
        <Component {...pageProps} />
      </StyledLayout>
    </CookiesProvider>
  )
}

export default MyApp
