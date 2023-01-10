import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import homeStyles from "../styles/Home.module.css"
import { ChangeEvent, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { useMoralis, useWeb3ExecuteFunction, useWeb3Contract } from "react-moralis"
import { useWeb3Enabled, useWeb3AccountChanges } from "@my-hooks"
import { useNotification, Bell, notifyType, Table, Avatar } from "web3uikit"
import { kyc } from "@my-contracts-functions"
import { ContractTransaction } from "ethers"

//Components
import TopElements from "@components/TopElements"

//Types
import { HardhatVMError } from "@my-types/HardhatVM"
import { returnBigNumber } from "@my-types/Web3Interfaces"

//Components

//Types

interface userBankAccountDetails {
  bankPublicAddress: string
  bankName: string
  sentUniqueProof: boolean
  uniqueProofApproval: boolean
  sentKYCAccess: boolean
  KYCStatus: boolean
}

interface userBankKYCStatus {
  userPublicAddress: string
  userBankAccountDetailsArr: userBankAccountDetails[]
}

const crossViewKYC: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const [entityCount, setEntityCount] = useState("0")
  const [userBankStatuses, setUserBankStatuses] = useState<userBankKYCStatus[]>([])
  const router = useRouter()
  const dispatch = useNotification()

  const blueButton =
    "bg-blue-500 hover:bg-blue-700 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer"

  const redButton =
    "bg-red-500 hover:bg-red-700 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer"

  const greenButton =
    "bg-green-500 hover:bg-green-700 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer"

  /**
   * @param tx ContractTransaction from "ethers"
   * @param type "error" | "success" | "info" | "warning"
   */
  const handleSuccess = async function (
    tx: ContractTransaction,
    type: notifyType,
    message: string,
    title: string
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

  //Reusing hooks from @my-hooks
  useWeb3Enabled(isWeb3Enabled, enableWeb3)
  useWeb3AccountChanges(Moralis, account, deactivateWeb3, router, 1)

  //Local usage hooks
  useEffect(() => {
    if (account) {
      getOwnEntityCount({
        onSuccess: (result) => {
          setEntityCount(parseInt((result as returnBigNumber)._hex).toString())
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

  const { runContractFunction: crossViewKYC } = kyc.readData(chainIdHex, useWeb3Contract, "crossViewKYC")

  const { runContractFunction: getOwnEntityCount } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getOwnEntityCount"
  )

  function handleClick() {
    if (entityCount != "0") {
      var completeFlag = true
      crossViewKYC({
        onSuccess: (result) => {
          console.log(result)
          setUserBankStatuses(result as userBankKYCStatus[])
        },
        onError: (error) => {
          const message: HardhatVMError = error as unknown as HardhatVMError
          if (message?.data?.message) console.log(message.data.message)
          else console.error(error)
        },
        params: {
          params: { bankAddress: account },
        },
      })
    }
  }

  useEffect(() => {
    if (userBankStatuses.length != 0) {
      console.log("userBankStatuses is:\n", userBankStatuses)
    }
  }, [userBankStatuses])

  function showData() {
    var sth: any[] = []
    for (var i = 0; i < userBankStatuses.length; i++) {
      var tempArr = []
      tempArr.push(
        userBankStatuses[i].userPublicAddress
          .slice(0, 6)
          .concat("...")
          .concat(userBankStatuses[i].userPublicAddress.slice(-4))
      )
      var tempSth: any[] = []
      for (var j = 0; j < userBankStatuses[i].userBankAccountDetailsArr.length; j++) {
        tempSth.push(userBankStatuses[i].userBankAccountDetailsArr[j].bankName+"\n")
      }
      if (tempSth.length != 0) {
        tempArr.push(tempSth)
      }
      tempSth = []
      for (var j = 0; j < userBankStatuses[i].userBankAccountDetailsArr.length; j++) {
        tempSth.push(userBankStatuses[i].userBankAccountDetailsArr[j].KYCStatus ? "Approved\n" : "Pending\n")
      }
      if (tempSth.length != 0) {
        tempArr.push(tempSth)
      }
      console.log("user banks are: ", userBankStatuses[i].userBankAccountDetailsArr)
      sth.push(tempArr)
    }
    return sth
  }

  return (
    <>
      <div className={homeStyles.container}>
        <Head>
          <title>View KYCs Received</title>
          <meta
            name="View KYCs Received page"
            content="This is where bank or related financial institutions can see KYCs that they received."
          />
        </Head>

        <TopElements account={account} />

        <main className={homeStyles.main} style={{ marginTop: "1vh", display: "inline-block" }}>
          <h1 className="text-4xl font-Inter font-bold underline mb-4">View sent KYC</h1>
          <div className="flex flex-col justify-center items-center flex-grow w-[100%]">
            <h2 className="text-xl font-Inter mt-4">Table here...</h2>
            <button className={blueButton} onClick={handleClick}>
              Get Data view
            </button>
            <div className="mt-10">
              <Table
                columnsConfig="3fr 3fr 3fr"
                header={[
                  <span className="font-Inter font-bold text-xl">Client Wallet Address</span>,
                  <span className="font-Inter font-bold text-xl">Bank Name</span>,
                  <span className="font-Inter font-bold text-xl">KYC Status</span>,
                ]}
                data={showData()}
                isColumnSortable={[false, false, false]}
                pageSize={10}
              />
            </div>
          </div>

          <div className="mt-4 mb-4 float-right">
            <Link href={"/bankInstitution_Homepage"}>
              <button className={blueButton}>Go back</button>
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}

export default crossViewKYC
