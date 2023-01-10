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

interface userAccountDetails {
  userPublicAddress: string
  sentUniqueProof: boolean
  uniqueProofApproval: boolean
  sentKYCAccess: boolean
  KYCStatus: boolean
}

const sendKYC: NextPage = () => {
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  const [entityCount, setEntityCount] = useState("0")
  const [userAccounts, setuserAccounts] = useState<userAccountDetails[]>([])
  const [tempRes, setTempRes] = useState<string[]>([])
  const [userPublicAddress, setUserPublicAddress] = useState<string[]>([])
  const [userName, setUserName] = useState<string[]>([])
  const [userHomeAddress, setUserHomeAddress] = useState<string[]>([])
  const [userDOB, setUserDOB] = useState<string[]>([])
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
      viewAllBankUserInfo({
        onSuccess: (result) => {
          console.log("result is: ", result)
          const res: userAccountDetails[] = result as userAccountDetails[]
          setuserAccounts(res)
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

  function func_getUserKYCDetails() {
    if (userAccounts) {
      for (var i = 0; i < userAccounts.length; i++) {
        getPermissionedUserDetails({
          onSuccess: (result) => {
            console.log("Result is: ", result)
          },
          onError: (error) => {
            console.error(error)
          },
          params: {
            params: { user: userAccounts[i].userPublicAddress },
          },
        })
      }
    }
  }

  useEffect(() => {
    if (userAccounts) {
      for (var i = 0; i < userAccounts.length; i++) {
        getPermissionedUserDetails({
          onSuccess: (result) => {
            console.log("Result is: ", result)
            var res: string[] = result as string[]
            setUserPublicAddress((prev) => [...prev, res[0]])
            setUserName((prev) => [...prev, res[1]])
            setUserHomeAddress((prev) => [...prev, res[2]])
            setUserDOB((prev) => [...prev, res[3]])
          },
          onError: (error) => {
            console.error(error)
          },
          params: {
            params: { user: userAccounts[i].userPublicAddress },
          },
        })
      }
    }
  }, [userAccounts])

  //Smart contract functions
  const { runContractFunction: getOwnEntityCount } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getOwnEntityCount"
  )

  const { runContractFunction: viewAllBankUserInfo } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "viewAllBankUserInfo"
  )

  const { runContractFunction: getPermissionedUserDetails } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getPermissionedUserDetails"
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

  function comp_userAccounts() {
    var sth: any[] = []
    for (var i = 0; i < userAccounts.length; i++) {
      var tempArr = []
      tempArr.push(
        userAccounts[i].userPublicAddress
          .slice(0, 6)
          .concat("...")
          .concat(userAccounts[i].userPublicAddress.slice(-4))
      )
      tempArr.push(userAccounts[i].sentUniqueProof ? "Yes" : "No")
      //   tempArr.push(userAccounts[i].uniqueProofApproval ? "Yes" : "No")
      tempArr.push(userAccounts[i].sentKYCAccess ? "Yes" : "No")
      tempArr.push(
        userAccounts[i].sentKYCAccess ? (
          <>
            <div>
              <p className="font-Inter font-bold">Public Address</p>
              <p>{userPublicAddress[i]}</p>
              <br />
              <p className="font-Inter font-bold">Name</p>
              <p>{userName[i]}</p>
              <br />
              <p className="font-Inter font-bold">Home Address</p>
              <p>{userHomeAddress[i]}</p>
              <br />
              <p className="font-Inter font-bold">Date of Birth</p>
              <p>{userDOB[i]}</p>
            </div>
          </>
        ) : (
          "Cannot view"
        )
      )
      tempArr.push(
        userAccounts[i].sentKYCAccess ? (
          <>
            <div className="flex flex-col gap-2">
              <button
                className={greenButton}
                onClick={() => {
                  handleNewNotification("Approve KYC", "Approving User's KYC details", "info")
                }}>
                Approve
              </button>
              <button
                className={redButton}
                onClick={() => {
                  handleNewNotification("Reject KYC", "Rejecting User's KYC details", "info")
                }}>
                Reject
              </button>
            </div>
          </>
        ) : (
          "Not received full KYC details yet"
        )
      )
      console.log("userDOB is: ", userDOB[i])
      // (comp_userKYCDetails(userAccounts[i].userPublicAddress))
      //   tempArr.push(userAccounts[i].KYCStatus ? "Yes" : "No")
      sth.push(tempArr)
    }
    return sth
  }

  return (
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
            Get User Accounts
          </button>
          <div className="mt-10">
            <Table
              columnsConfig="3fr 3fr 3fr 3fr 3fr"
              header={[
                <span className="font-Inter font-bold text-xl">Client Wallet Address</span>,
                <span className="font-Inter font-bold text-xl">Unique Proof</span>,
                <span className="font-Inter font-bold text-xl">KYC Access</span>,
                <span className="font-Inter font-bold text-xl">KYC Details</span>,
                <span className="font-Inter font-bold text-xl">Approve KYC</span>,
              ]}
              data={comp_userAccounts()}
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
  )
}

export default sendKYC
