import Head from "next/head"
import { useMoralis, useWeb3Contract, useWeb3ExecuteFunction } from "react-moralis"
import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useWeb3Enabled, useWeb3AccountChanges } from "@my-hooks"
import { kyc } from "@my-contracts-functions"
import { Input, useNotification, Bell, notifyType } from "web3uikit"
import { ContractTransaction } from "ethers"

//CSS
import homeStyles from "../styles/Home.module.css"

//Components
import TopElements from "@components/TopElements"
import Overlay from "@components/Overlay"

//Types
import type { NextPage } from "next"
import { HardhatVMError } from "@my-types/HardhatVM"
import { returnBigNumber } from "@my-types/Web3Interfaces"

const bank_RegisterPage: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [entityCount, setEntityCount] = useState("0")
  const [contractNotExist, setContractNotExist] = useState(false)
  const dispatch = useNotification()

  const [isOpen, setIsOpen] = useState(false)

  const toggleOverlay = () => {
    setIsOpen(!isOpen)
  }

  /**
   * @param tx ContractTransaction from "ethers"
   * @param type "error" | "success" | "info" | "warning"
   */
  const handleSuccess = async function (
    tx: ContractTransaction,
    type: notifyType,
    title: string,
    message: string
  ) {
    console.log("tx is type of: ", typeof tx)
    try {
      await tx?.wait(1)
    } catch (error) {
      console.log(error)
    }
    handleNewNotification(type, title, message)
  }

  /**
   * @param type "error" | "success" | "info" | "warning"
   */
  const handleNewNotification = function (type: notifyType, title: string, message: string) {
    dispatch({
      title: title,
      message: message,
      type: type,
      position: "topR",
      icon: <Bell />,
    })
  }

  const greenButton =
    "bg-[#A5F9A4] hover:bg-green-500 text-white font-normal text-xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px]"

  //Reusing hooks from @my-hooks
  useWeb3Enabled(isWeb3Enabled, enableWeb3)
  useWeb3AccountChanges(Moralis, account, deactivateWeb3, router, 1)

  //Smart Contract Functions
  const { runContractFunction: getOwnEntityCount } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getOwnEntityCount"
  )

  const { fetch: addBanks } = kyc.writeData(chainIdHex, useWeb3ExecuteFunction, "addBanks")

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
          else console.log(error)
        },
        params: {
          params: { user: account },
        },
      })
    }
  }, [account])

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    var val = (e.nativeEvent.target as HTMLInputElement)?.value
    console.log("value of e is: ", val)
    setUserName(val)
  }

  function func_addBanks() {
    toggleOverlay()
    setTimeout(() => {
      var completeFlag = true
      addBanks({
        onComplete: () => {
          if (completeFlag == false) return
          handleNewNotification("info", "Pending Adding User", "Adding user now...")
        },
        onSuccess: (result) => {
          handleSuccess(
            result as ContractTransaction,
            "success",
            "Success",
            "You have successfully registered"
          )
          setIsOpen(false)
          alert("You have been registered as a Bank/Financial Institution user!")
          router.reload()
        },
        onError: (error) => {
          const message: HardhatVMError = error as unknown as HardhatVMError
          if (message?.data?.message) console.log(message.data.message)
          else console.log(error)
          completeFlag = false
          setIsOpen(false)
        },
        params: {
          params: { name: userName },
        },
      })
    }, 2000)
  }

  function handleClick(e: any) {
    console.log("Clicked")
    console.log("userName is: ", userName)
    if (userName) {
      func_addBanks()
    }
  }

  function comp_RegisterUser() {
    return (
      <>
        <p className="text-[20px]">Your Bank/Financial Institution name</p>
        <div className="flex flex-col justify-center items-center flex-grow w-[100%]">
          <div className="mt-4">
            <Input
              name="Bank/Financial Institution Name"
              id="Register02"
              label="Click and fill here"
              type="text"
              onChange={handleInput}
            />
          </div>
          <div className="flex flex-row mt-8 justify-center gap-8 w-[100%]">
            <button className={greenButton} onClick={handleClick}>
              <p className="text-black">Register</p>
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClose={toggleOverlay} />
      <div className={homeStyles.container}>
        <Head>
          <title>Register as Bank/Financial Insitution</title>
          <meta
            name="Register as Bank page"
            content="This is where banks or related financial institutions"
          />
        </Head>

        <TopElements account={account} />

        <main className={homeStyles.main} style={{ marginTop: "1vh", display: "inline-block" }}>
          <h1 className="text-4xl font-Inter font-bold underline mb-4">
            Register as Bank/Financial Institution User
          </h1>
          <div className="mt-[4rem] flex flex-col justify-center items-center">
            {entityCount === "0" ? (
              comp_RegisterUser()
            ) : (
              <p className="text-[20px]">You have already registered!</p>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default bank_RegisterPage
