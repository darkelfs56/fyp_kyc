import { useState, useEffect } from "react"
import MoralisType from "moralis-v1"
import { NextRouter } from "next/router"

/**Checks whether isWeb3Enabled is true OR if exists "connected" item in window then enableWeb3() */
function useWeb3Enabled(isWeb3Enabled: boolean, enableWeb3: Function) {
  useEffect(() => {
    if (isWeb3Enabled) return
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])
}

/**Checks whether web3 account changes or not, if account == null,
 * then remove "connected" and "login" item, run deactivateWeb3(). mode == 0 means at index page */
function useWeb3AccountChanges(
  Moralis: MoralisType,
  account: string | null,
  deactivateWeb3: Function,
  router: NextRouter,
  mode: number
) {
  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`)
      if (account == null) {
        window.localStorage.removeItem("connected")
        window.localStorage.removeItem("login")
        deactivateWeb3()
        console.log("Null account found. Deactivating web3")
        if (mode != 0) {
          if (!window.localStorage.getItem("login")) {
            router.push("/")
          }
        }
      }
      if(account != null) {
        router.reload()
      }
    })
  }, [])
}

export { useWeb3Enabled, useWeb3AccountChanges }
