import Head from "next/head"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useWeb3Enabled, useWeb3AccountChanges } from "@my-hooks"
import { kyc } from "@my-contracts-functions"

//CSS
import homeStyles from "../styles/Home.module.css"

//Components
import TopElements from "@components/TopElements"
import BottomElements_BankInstitution from "@components/BottomElements_BankInstitution"

//Types
import type { NextPage } from "next"
import { HardhatVMError } from "@my-types/HardhatVM"
import { returnBigNumber } from "@my-types/Web3Interfaces"

const bankInstitution_Homepage: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const router = useRouter()
  const [entityCount, setEntityCount] = useState("0")
  const [contractNotExist, setContractNotExist] = useState(false)

  //Reusing hooks from @my-hooks
  useWeb3Enabled(isWeb3Enabled, enableWeb3)
  useWeb3AccountChanges(Moralis, account, deactivateWeb3, router, 1)

  //Smart Contract Functions
  const {runContractFunction: getOwnEntityCount} = kyc.readData(chainIdHex, useWeb3Contract, "getOwnEntityCount")

  //Local usage of hooks
  useEffect(() => {
    if (account) {
      getOwnEntityCount({
        onSuccess: (result) => {
          setEntityCount(parseInt((result as returnBigNumber)._hex).toString())
          // console.log("User count is: ", parseInt((result as returnBigNumber)._hex))
        },
        onError: (error) => {
          const message: HardhatVMError = error as unknown as HardhatVMError
          if(message?.data?.message) console.log(message.data.message)
          else(setContractNotExist(true))
        },
        params: {
          params: { user: account },
        },
      })
    }
  }, [account])

  return (
    <>
      <div className={homeStyles.container}>
        <Head>
          <title>Bank/Financial Institution Homepage</title>
          <meta name="Individual User Homepage" content="This is your personal user homepage" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <TopElements account={account} />
      </div>
      <div className="flex flex-col flex-1 mt-[1vh]">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl text-center font-Inter font-normal">
            WELCOME <br /> Bank/Financial Institution User,{" "}
            {account ? account.slice(0, 6) + "..." + account.slice(account.length - 4) : "walletAddress"}
          </h1>
          <div className="mt-10 text-center">
            {contractNotExist && <h1>Smart contract is not found or deployed!</h1>}
            {account && entityCount != "0" ? <p>User count is {entityCount}</p> : <p>User has not registered with the system!</p>}
          </div>
        </div>
        <BottomElements_BankInstitution entityCount={parseInt(entityCount)} />
      </div>
    </>
  )
}

export default bankInstitution_Homepage
