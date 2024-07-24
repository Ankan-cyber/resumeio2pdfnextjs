import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Footer from './Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/announcement.css'

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Component {...pageProps} />
    <Footer />
    <ToastContainer />
  </>


}
