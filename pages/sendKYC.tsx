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
import Overlay from "@components/Overlay"

//Types
import { HardhatVMError } from "@my-types/HardhatVM"
import { returnBigNumber } from "@my-types/Web3Interfaces"

interface getBanksResult {
  bankAddress: string[]
  bankName: string[]
}

interface selectedResult {
  id: string
  label: string
}

const sendKYC: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const [walletAddressText, setWalletAddressText] = useState("")
  const [entityCount, setEntityCount] = useState("0")
  const [banksAddress, setBanksAddress] = useState<string[]>([])
  const [banksName, setBanksName] = useState<string[]>([])
  const [dropdownData, setDropdownData] = useState<selectedResult[]>([])
  const [selectedBank, setSelectedBank] = useState("")
  const router = useRouter()
  const dispatch = useNotification()

  const [isOpen, setIsOpen] = useState(false)

  const toggleOverlay = () => {
    setIsOpen(!isOpen)
  }

  const greenButton =
    "bg-[#A5F9A4] hover:bg-green-500 text-white font-normal text-xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px]"

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

  function checkBeforeSend() {
    var canSend = true
    switch (canSend) {
      case selectedBank == "":
        handleNewNotification("error", "Error: Empty wallet address", "Cannot send to empty address!")
        canSend = false
        break
      case entityCount == "0":
        handleNewNotification("error", "Error: No KYC data", "You haven't set up KYC yet!")
        canSend = false
        break
      case isAddress(selectedBank) == false:
        handleNewNotification(
          "error",
          "Error: Invalid wallet address",
          "Please enter a valid wallet address!"
        )
        canSend = false
        break
    }
    return canSend
  }

  function sendUniqueProof() {
    if (checkBeforeSend() == false) return
    console.log("Sending user's unique proof to: ", walletAddressText)
    handleNewNotification(
      "error",
      "sendUniqueProof Not Implemented",
      "Function sendUniqueProof not implemented yet."
    )
  }

  function func_sendViewPermission() {
    toggleOverlay()
    setTimeout(() => {
      var completeFlag = true
      sendViewPermission({
        onComplete: () => {
          if (completeFlag == false) return
          handleNewNotification("info", "Pending", "Sending KYC view permission to wallet address...")
        },
        onSuccess: (result) => {
          console.log("Success")
          console.log("result is: ", result)
          handleNewNotification("success", "Success", "KYC view permission sent!")
          setIsOpen(false)
        },
        onError: (error) => {
          handleNewNotification("error", "Error", "Error sending KYC view permission!")
          const message: HardhatVMError = error as unknown as HardhatVMError
          if (message?.data?.message) console.log(message.data.message)
          else {
            try {
              var err_mes = error.message.match(/(?<=VM Exception while processing transaction: ).*/g)![0]
              var sth_mes = err_mes.match(/(?:reverted with reason string '[a-zA-Z0-9\. ]+')*/g)![0]
              console.log("err_mes is: ", err_mes)
              console.log("sth_mes is: ", sth_mes)
              handleNewNotification("error", "KYC View Permission already sent", sth_mes)
              console.log("error message is: ", error)
            } catch (err) {
              console.log(error)
            }
          }
          completeFlag = false
          setIsOpen(false)
        },
        params: {
          params: { bankAddress: selectedBank, mode: 2 },
        },
      })
    }, 2000)
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
        if (result == null) {
          console.log("result is null")
          return
        } else {
          var res = result as getBanksResult
          setBanksAddress(res.bankAddress)
          setBanksName(res.bankName)
          var data: selectedResult[] = []
          for (var i = 0; i < res.bankAddress.length; i++) {
            data.push({ id: res.bankAddress[i], label: res.bankName[i] })
          }
          setDropdownData(data)
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
    if (banksName != undefined) {
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

  function comp_ShowInstructions() {
    return (
      <>
        <div className="mt-4">
          <ul className="mt-4 mb-10 ml-5 list-decimal text-left">
            <li>This is where you can send your KYC details to banks or related parties.</li>
            <li>You need to choose a bank or party from the dropdown menu.</li>
            <li>Once you have chosen a bank or related party, click one of the buttons.</li>
            <li>Click 'Give KYC Access' if you want to give view permission of your full KYC details.</li>
            <li>
              Click 'Send Unique Proof' if you have a Unique Proof for faster approval and don't <br />
              them to view your full KYC details.
            </li>
            <li>
              You should have a Unique Proof if your KYC details have been verified by a <br />
              trusted source.
            </li>
          </ul>
        </div>
      </>
    )
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClose={toggleOverlay} />
      <div className={homeStyles.container}>
        <Head>
          <title>Send KYC</title>
          <meta name="Send KYC page" content="This is where you can send your KYC" />
        </Head>

        <TopElements account={account} />

        <main className={homeStyles.main} style={{ marginTop: "1vh", display: "inline-block" }}>
          <div>
            <h1 className="text-4xl font-Inter font-bold underline mb-4">Send your KYC</h1>
            {comp_ShowInstructions()}
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-[20px]">Bank/Financial Institution wallet address</p>
            <div className="flex flex-col justify-center items-center flex-grow w-[100%]">
              <div className="flex flex-col gap-4 mt-4">
                <Select
                  name="KYCSendSelect01"
                  id="KYCSendSelect01"
                  label="Select the wallet address you want to send your KYC to"
                  width="30rem"
                  onChange={handleSelected}
                  options={dropdownData}
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
    </>
  )
}

export default sendKYC
