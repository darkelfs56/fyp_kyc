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
import BottomElements_User from "@components/BottomElements_User"

//Types
import type { NextPage } from "next"
import { HardhatVMError } from "@my-types/HardhatVM"
import { returnBigNumber } from "@my-types/Web3Interfaces"

const individualUser_Homepage: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const router = useRouter()
  const [entityCount, setEntityCount] = useState("0")
  const [contractNotExist, setContractNotExist] = useState(false)

  //Reusing hooks from @my-hooks
  useWeb3Enabled(isWeb3Enabled, enableWeb3)
  useWeb3AccountChanges(Moralis, account, deactivateWeb3, router, 1)

  //Smart Contract Functions
  const { runContractFunction: getOwnEntityCount } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getOwnEntityCount"
  )

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
          if (message?.data?.message) console.log(message.data.message)
          else setContractNotExist(true)
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
          <title>Individual User Homepage</title>
          <meta name="Individual User Homepage" content="This is your personal user homepage" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <TopElements account={account} />
      </div>
      <div className="flex flex-col flex-1 mt-[1vh]">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl text-center font-Inter font-normal">
            WELCOME <br /> Invididual User,{" "}
            {account ? account.slice(0, 6) + "..." + account.slice(account.length - 4) : "walletAddress"}
          </h1>
          <div className="mt-10 text-center">
            {contractNotExist && <h1>Smart contract is not found or deployed!</h1>}
            <p className="underline">How to use this KYC system?</p>
            <ul className="mt-4 list-decimal text-left">
              <li>Set-up your KYC details first by clicking the 'Set-up KYC' button.</li>
              <li>
                After setting up your KYC details, you can view your KYC details on the same page <br />
                (the button would change to 'Change KYC details').
              </li>
              <li>
                If you already set-up your KYC details, you can send it by clicking the <br />
                'Send KYC' button, it should be in green color now.
              </li>
              <li>If you have sent any KYCs, you can view them by clicking the 'View Sent KYCs' button.</li>
            </ul>
          </div>
          <div className="mt-14 text-xl font-Inter font-bold">
            {account && entityCount != "0" ? (
              <h2>User count is {entityCount}</h2>
            ) : (
              <h2>User has not set up KYC.</h2>
            )}
          </div>
        </div>
        <BottomElements_User entityCount={parseInt(entityCount)} />
      </div>
    </>
  )
}

export default individualUser_Homepage
