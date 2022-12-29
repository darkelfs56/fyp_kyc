import "../styles/globals.css"
import "tailwindcss/tailwind.css"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { Inter } from "@next/font/google"

//Need to define outside of the MyApp function
const inter = Inter({ subsets: ["latin"] })

//REMINDER: No such thing as blokchain is offline, 
// hence cannot check if the blockchain is online or not

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
          }
        `}
      </style>
      <MoralisProvider initializeOnMount={false}>
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
      </MoralisProvider>
    </>
  )
}

export default MyApp
