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

interface userBankAccountDetails {
  bankPublicAddress: string
  bankName: string
  sentUniqueProof: boolean
  uniqueProofApproval: boolean
  sentKYCAccess: boolean
  KYCStatus: boolean
}

const sendKYC: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const [walletAddressText, setWalletAddressText] = useState("")
  const [entityCount, setEntityCount] = useState("0")
  const [banksAddress, setBanksAddress] = useState<string[]>([])
  const [banksName, setBanksName] = useState<string[]>([])
  const [userBanks, setUserBanks] = useState<userBankAccountDetails[]>([])
  const router = useRouter()
  const dispatch = useNotification()

  const blueButton =
    "bg-blue-500 hover:bg-blue-700 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer"

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

  function handleClick() {
    if (entityCount != "0") {
      getDetailedBankAccounts({
        onSuccess: (result) => {
          console.log("result is: ", result)
          const bankAccounts: userBankAccountDetails[] = result as userBankAccountDetails[]
          setUserBanks(bankAccounts)
          const bankAddresses: string[] = []
          const bankNames: string[] = []
          bankAccounts.forEach((bankAccount) => {
            bankAddresses.push(bankAccount.bankPublicAddress)
            bankNames.push(bankAccount.bankName)
          })
          setBanksAddress(bankAddresses)
          setBanksName(bankNames)
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
  }

  //Smart contract functions
  const { runContractFunction: getOwnEntityCount } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getOwnEntityCount"
  )

  const { runContractFunction: getDetailedBankAccounts } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getDetailedBankAccounts"
  )

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

  function comp_userBanks() {
    var sth: any[] = []
    for (var i = 0; i < userBanks.length; i++) {
      var tempArr = []
      tempArr.push(
        userBanks[i].bankPublicAddress
          .slice(0, 6)
          .concat("...")
          .concat(userBanks[i].bankPublicAddress.slice(-4))
      )
      tempArr.push(userBanks[i].bankName)
      tempArr.push(userBanks[i].sentUniqueProof ? "Yes" : "No")
      tempArr.push(userBanks[i].uniqueProofApproval ? "Yes" : "No")
      tempArr.push(userBanks[i].sentKYCAccess ? "Yes" : "No")
      tempArr.push(userBanks[i].KYCStatus ? "Yes" : "No")
      sth.push(tempArr)
    }
    return sth
  }

  useEffect(() => {
    if (banksName != undefined) {
      console.log("banksAddress are: ", banksAddress)
      console.log("banksName are: ", banksName)
    }
    if (userBanks != undefined) {
      console.log("userBanks are: ", userBanks)
      console.log("userBanks[0].bankPublicAddress is: ", userBanks[0]?.bankPublicAddress)
    }
  }, [banksName, userBanks])

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Send KYC</title>
        <meta name="Sent KYC page" content="This is where you can see your sent KYCs" />
      </Head>

      <TopElements account={account} />

      <main className={homeStyles.main} style={{ marginTop: "1vh", display: "inline-block" }}>
        <h1 className="text-4xl font-Inter font-bold underline mb-4">View sent KYC</h1>
        <div className="flex flex-col justify-center items-center flex-grow w-[100%]">
          <h2 className="text-xl font-Inter mt-4">Table here...</h2>
          <button className={blueButton} onClick={handleClick}>
            Get Banks
          </button>
          <div className="mt-10">
            <Table
              columnsConfig="3fr 3fr 3fr 3fr 3fr 3fr"
              header={[
                <span className="font-Inter font-bold text-xl">Bank Address</span>,
                <span className="font-Inter font-bold text-xl">Bank/Institution Name</span>,
                <span className="font-Inter font-bold text-xl">Unique Proof</span>,
                <span className="font-Inter font-bold text-xl">Unique Proof Approval Status</span>,
                <span className="font-Inter font-bold text-xl">KYC view access</span>,
                <span className="font-Inter font-bold text-xl">KYC Approval Status</span>,
              ]}
              data={
                // userBanks.map((bank: userBankAccountDetails) => {
                //   return (
                //     bank.bankPublicAddress,
                //     bank.bankName,
                //     bank.sentUniqueProof,
                //     bank.uniqueProofApproval,
                //     bank.sentKYCAccess,
                //     bank.KYCStatus
                //   )
                // }),
                comp_userBanks()
              }
              isColumnSortable={[false, false, false, false, false, false]}
              pageSize={10}
            />
          </div>
        </div>

        <div className="mt-4 mb-4 float-right">
          <Link href={"/individualUser_Homepage"}>
            <button className={blueButton}>Go back</button>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default sendKYC
