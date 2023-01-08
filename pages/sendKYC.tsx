import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import homeStyles from "../styles/Home.module.css"
import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useMoralis, useWeb3ExecuteFunction, useWeb3Contract } from "react-moralis"
import { useWeb3Enabled, useWeb3AccountChanges } from "@my-hooks"
import { Input, useNotification, Bell, notifyType, Select } from "web3uikit"
import { kyc } from "@my-contracts-functions"
import { ContractTransaction } from "ethers"
import { isAddress } from "ethers/lib/utils"

//Components
import TopElements from "@components/TopElements"

//Types
import { HardhatVMError } from "@my-types/HardhatVM"
import { returnBigNumber } from "@my-types/Web3Interfaces"

interface getBanksResult {
  bankAddress: string[]
  bankName: string[]
}

interface selectedResult {
  id: string,
  label: string,
}

const sendKYC: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const [walletAddressText, setWalletAddressText] = useState("")
  const [entityCount, setEntityCount] = useState("0")
  const [banksAddress, setBanksAddress] = useState<string[]>([])
  const [banksName, setBanksName] = useState<string[]>([])
  const [selectedBank, setSelectedBank] = useState("")
  const router = useRouter()
  const dispatch = useNotification()

  const greenButton =
    "bg-[#A5F9A4] hover:bg-green-500 text-white font-normal text-xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px]"

  /**
   * @param tx ContractTransaction from "ethers"
   * @param type "error" | "success" | "info" | "warning"
   */
  const handleSuccess = async function (
    tx: ContractTransaction,
    message: string,
    title: string,
    type: notifyType
  ) {
    console.log("tx is type of: ", typeof tx)
    try {
      await tx?.wait(1)
    } catch (error) {
      console.log(error)
    }
    handleNewNotification(title, message, type)
  }

  /**
   * @param type "error" | "success" | "info" | "warning"
   */
  const handleNewNotification = function (title: string, message: string, type: notifyType) {
    dispatch({
      title: title,
      message: message,
      type: type,
      position: "topR",
      icon: <Bell />,
    })
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    var val = (e.nativeEvent.target as HTMLInputElement)?.value
    console.log("value of e is: ", val)
    setWalletAddressText(val)
  }

  function checkBeforeSend() {
    var canSend = true
    switch (canSend) {
      case selectedBank == "":
        handleNewNotification("Error: Empty wallet address", "Cannot send to empty address!", "error")
        canSend = false
        break
      case entityCount == "0":
        handleNewNotification("Error: No KYC data", "You haven't set up KYC yet!", "error")
        canSend = false
        break
      case isAddress(selectedBank) == false:
        handleNewNotification(
          "Error: Invalid wallet address",
          "Please enter a valid wallet address!",
          "error"
        )
        canSend = false
        break
    }
    return canSend
  }

  function sendUniqueProof() {
    if (checkBeforeSend() == false) return
    console.log("Sending user's unique proof to: ", walletAddressText)
  }

  function func_sendViewPermission() {
    var completeFlag = true
    sendViewPermission({
      onComplete: () => {
        if (completeFlag == false) return
        handleNewNotification("Pending", "Sending KYC view permission to wallet address...", "info")
      },
      onSuccess: (result) => {
        console.log("Success")
        console.log("result is: ", result)
        handleNewNotification("Success", "KYC view permission sent!", "success")
      },
      onError: (error) => {
        handleNewNotification("Error", "Error sending KYC view permission!", "error")
        const message: HardhatVMError = error as unknown as HardhatVMError
        if (message?.data?.message) console.log(message.data.message)
        else {
          var err_mes = error.message.match(/(?<=VM Exception while processing transaction: ).*/g)![0]
          var sth_mes = err_mes.match(/(?:reverted with reason string '[a-zA-Z0-9\. ]+')*/g)![0]
          console.log("err_mes is: ", err_mes)
          console.log("sth_mes is: ", sth_mes)
          console.log("error message is: ", error)
        }
        completeFlag = false
      },
      params: {
        params: { bankAddress: selectedBank, mode: 2 },
      },
    })
  }

  function func_getBanks() {
    var completeFlag = true
    getBanks({
      onComplete: () => {
        if (completeFlag) console.log("Completed.")
      },
      onSuccess: (result) => {
        console.log("Success")
        console.log("result is: ", result)
        if(result == null) {console.log("result is null"); return}
        else {
          var res = result as getBanksResult
          setBanksAddress(res.bankAddress)
          setBanksName(res.bankName)
        }
      },
      onError: (error) => {
        const message: HardhatVMError = error as unknown as HardhatVMError
        if (message?.data?.message) console.log(message.data.message)
        else console.error(error)
        completeFlag = false
      },
      params: {
        params: { bankAddress: walletAddressText, mode: 2 },
      },
    })
  }

  function handleSelected(e: any) {
    // var val = (e.nativeEvent.target as HTMLSelectElement)?.value
    // console.log("value of e is: ", val)
    // setSelectedBank(val)
    console.log("e is: ", e)
    try {
      var val = e as selectedResult
      console.log("bank selected is: ", val.label)
      console.log("bank address is: ", val.id)
      setSelectedBank(val.id)
    } catch (error) {}
  }

  function sendKYCAccess() {
    if (checkBeforeSend() == false) return
    console.log("Sending user's KYC view access to: ", selectedBank)
    func_sendViewPermission()
  }

  //Smart contract functions
  const { runContractFunction: getOwnEntityCount } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getOwnEntityCount"
  )
  const { runContractFunction: getBanks } = kyc.readData(chainIdHex, useWeb3Contract, "getBanks")
  const { fetch: sendViewPermission } = kyc.writeData(
    chainIdHex,
    useWeb3ExecuteFunction,
    "sendViewPermission"
  )

  //Reusing hooks from @my-hooks
  useWeb3Enabled(isWeb3Enabled, enableWeb3)
  useWeb3AccountChanges(Moralis, account, deactivateWeb3, router, 1)

  //Local usage hooks
  useEffect(() => {
    console.log("walletAddressText is: ", walletAddressText)
  }, [walletAddressText])

  useEffect(() => {
    if(banksName != undefined) {
      console.log("banksAddress are: ", banksAddress)
      console.log("banksName are: ", banksName)
    }
  }, [banksName])

  useEffect(() => {
    if (account) {
      getOwnEntityCount({
        onSuccess: (result) => {
          setEntityCount(parseInt((result as returnBigNumber)._hex).toString())
          func_getBanks()
        },
        onError: (error) => {
          const message: HardhatVMError = error as unknown as HardhatVMError
          if (message?.data?.message) console.log(message.data.message)
          else console.error(error)
        },
        params: {
          params: { user: account },
        },
      })
    }
  }, [account])

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Send KYC</title>
        <meta name="Send KYC page" content="This is where you can send your KYC" />
      </Head>

      <TopElements account={account} />

      <main className={homeStyles.main} style={{ marginTop: "1vh", display: "inline-block" }}>
        <h1 className="text-4xl font-Inter font-bold underline mb-4">Send your KYC</h1>
        <div className="flex flex-col justify-center items-center">
          <p className="text-[20px]">Bank/Financial Institution wallet address</p>
          <div className="flex flex-col justify-center items-center flex-grow w-[100%]">
            <div className="flex flex-col gap-4 mt-4">
              {/* <Input
                name="KYCSendInput01"
                id="KYCSendInput01"
                label="Click and fill here"
                type="text"
                onChange={handleInput}
              /> */}
              <Select
                name="KYCSendSelect01"
                id="KYCSendSelect01"
                label="Select the wallet address you want to send your KYC to"
                width="30rem"
                onChange={handleSelected}
                options={[
                  {
                    id: banksAddress[0],
                    label: banksName[0],
                  }
                ]}
              />
            </div>
            <div className="flex flex-row mt-8 justify-center gap-8 w-[100%]">
              <button className={greenButton} onClick={sendUniqueProof}>
                <p className="text-black">Send Unique Proof</p>
              </button>
              <button className={greenButton} onClick={sendKYCAccess}>
                <p className="text-black">Give KYC access</p>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-3">
          <Link href={"/individualUser_Homepage"}>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-normal text-2xl py-4 px-8 rounded-[50px] w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer">
              Go back
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default sendKYC
