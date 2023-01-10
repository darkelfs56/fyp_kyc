import type { NextPage } from "next"
import Head from "next/head"
import { Form, useNotification, Bell, notifyType } from "web3uikit"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useMoralis, useWeb3ExecuteFunction, useWeb3Contract } from "react-moralis"
import { ContractTransaction } from "ethers"
import { contractAddresses, abi } from "@web3Constants"
import { useWeb3Enabled, useWeb3AccountChanges } from "@my-hooks"
import { kyc } from "@my-contracts-functions"

//CSS
import homeStyles from "../styles/Home.module.css"

//Components
import TopElements from "../components/TopElements"
import Overlay from "@components/Overlay"

//Types
import { HardhatVMError } from "@my-types/HardhatVM"
import { contractAddressesInterface, returnBigNumber } from "@my-types/Web3Interfaces"
import Link from "next/link"

interface Props {
  account: string | null
  mode: number
}

interface input {
  inputName: string
  inputResult: string
  key?: string
}

interface formData {
  data: input[]
  id: string
}

//Need to create custom hooks for code abstraction

const setupKYC: NextPage<Props> = (props) => {
  const [refreshButton, setRefreshButton] = useState(false)
  const [runAddUsers, setRunAddUsers] = useState(false)
  const [runChangeUserDetails, setRunChangeUserDetails] = useState(false)
  const [entityCount, setEntityCount] = useState("0")
  const [someObject, setSomeObject] = useState({})
  const [userName, setUserName] = useState("")
  const [userDateOfBirth, setUserDateOfBirth] = useState("")
  const [userHomeAddress, setUserHomeAddress] = useState("")
  const [userDetails, setUserDetails] = useState([])
  const [contractNotExist, setContractNotExist] = useState(false)
  const router = useRouter()
  const { account, Moralis, isWeb3Enabled, enableWeb3, deactivateWeb3, chainId: chainIdHex } = useMoralis()
  // const addresses: contractAddressesInterface = contractAddresses
  // const chainId: string = parseInt(chainIdHex!).toString()
  // const kycAddress = chainId in addresses ? addresses[chainId][0] : null

  const dispatch = useNotification()
  const [isOpen, setIsOpen] = useState(false)

  const toggleOverlay = () => {
    setIsOpen(!isOpen)
  }

  function OverlayChildren() {
    return <h1>Overlay content!</h1>
  }

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

  function checkFlag(input: string, varName: string) {
    var res = false
    input == "" ? (res = false) : (res = true)
    return res
  }

  function giveAlert(flag: boolean, varName: string) {
    if (!flag) {
      alert("Please refresh and properly set your " + varName + "!")
      router.reload()
    }
  }

  const { fetch: changeUserDetails } = kyc.writeData(chainIdHex, useWeb3ExecuteFunction, "changeUserDetails")
  const { fetch: addUsers } = kyc.writeData(chainIdHex, useWeb3ExecuteFunction, "addUsers")
  const { runContractFunction: getOwnEntityCount } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getOwnEntityCount"
  )
  const { runContractFunction: getPermissionedUserDetails } = kyc.readData(
    chainIdHex,
    useWeb3Contract,
    "getPermissionedUserDetails"
  )

  function extractObjectDetails(theObject: {}, inputName: string) {
    var res = ""
    if (inputName != "Date of Birth") {
      var sth = (theObject as formData)?.data?.filter((item) => item.inputName == inputName)[0]?.inputResult
      if (sth != "") res = sth
    } else if (inputName == "Date of Birth") {
      var birthArr = (theObject as formData)?.data
        ?.filter((item) => item.inputName == inputName)[0]
        ?.inputResult[0]?.split(" ")
      if (birthArr && (birthArr as []).length != 0) {
        var dateOfBirth = birthArr[1] + " " + birthArr[2] + " " + birthArr[3]
        res = dateOfBirth
      }
    }
    return res
  }

  function func_AddUsers() {
    toggleOverlay()
    setTimeout(() => {
      var completeFlag = true
      addUsers({
        onComplete: () => {
          if (completeFlag == false) return
          handleNewNotification("info", "Pending KYC Setup", "Your KYC setup is pending! Please wait!")
        },
        onSuccess: (result) => {
          console.log("Success")
          console.log(result)
          setTimeout(async () => {
            await handleSuccess(
              result as ContractTransaction,
              "success",
              "Your KYC setup was successful!",
              "Successful KYC setup"
            )
            setIsOpen(false)
            alert("KYC setup success! Refreshing page now...")
            router.reload()
          }, 1000)
        },
        onError: (error) => {
          console.error(error)
          completeFlag = false
          console.log("Does it go here?")
          setIsOpen(false)
          handleNewNotification("error", "Error", "There was an error in setting up your KYC.")
        },
        params: {
          params: {
            name: userName,
            homeAddress: userHomeAddress,
            dateOfBirth: userDateOfBirth,
          },
        },
      })
    }, 2000)
  }

  function func_changeUserDetails() {
    if (userName == "" && userHomeAddress == "" && userDateOfBirth == "") {
      alert("No data was provided to change user details. Refreshing now...")
      router.reload()
      return
    }
    toggleOverlay()
    setTimeout(() => {
      var completeFlag = true
      changeUserDetails({
        onComplete: () => {
          if (completeFlag) {
            handleNewNotification(
              "info",
              "Changing User Details",
              "Changing your user details now. Please wait!"
            )
          }
          setRefreshButton(true)
        },
        onSuccess: (result) => {
          console.log("Success")
          console.log(result)
          setTimeout(async () => {
            await handleSuccess(
              result as ContractTransaction,
              "success",
              "You successfully change your user detaisl",
              "Succesful changes to user details"
            )
            alert("Your KYC details has been successfully changed! Refreshing now...")
            setIsOpen(false)
            router.reload()
          }, 1000)
        },
        onError: (error) => {
          console.error(error)
          completeFlag = false
          setIsOpen(false)
          handleNewNotification("error", "Error", "There was an error changing your user details")
        },
        params: {
          params: {
            //using someObject would send an 'empty' value
            name: userName == "" ? someObject : userName,
            homeAddress: userHomeAddress == "" ? someObject : userHomeAddress,
            dateOfBirth: userDateOfBirth == "" ? someObject : userDateOfBirth,
          },
        },
      })
    }, 2000)
  }

  function handleClick(e: unknown) {
    setRefreshButton(true)
    var sth = e as formData
    var nameFlag = checkFlag(sth.data[0].inputResult, "Name")
    var birthFlag = checkFlag(sth.data[1].inputResult, "Birth")
    var addressFlag = checkFlag(sth.data[2].inputResult, "Address")
    giveAlert(nameFlag, "Full Name")
    giveAlert(birthFlag, "Date of Birth")
    giveAlert(addressFlag, "Home Address")

    var birthYear = sth.data[1].inputResult[0].split(" ")[3]
    var currentYear = new Date().getFullYear()
    if (birthYear.length != 4 || parseInt(birthYear) < currentYear - 200) {
      alert(
        "Invalid year for date of birth! \
      \nBtw, humans can't live more than 200 years.\
      \n\n Refreshing page now..."
      )
      router.reload()
      return
    }

    // setTimeout(() => {Router.reload()}, 10000);
    if (nameFlag && birthFlag && addressFlag) {
      setUserName(extractObjectDetails(someObject, "Full Name"))
      setUserDateOfBirth(extractObjectDetails(someObject, "Date of Birth"))
      setUserHomeAddress(extractObjectDetails(someObject, "Home Address"))
      setRunAddUsers(true)
      setSomeObject({})
    }
  }

  //Reusing hooks from @my-hooks
  useWeb3Enabled(isWeb3Enabled, enableWeb3)
  useWeb3AccountChanges(Moralis, account, deactivateWeb3, router, 1)

  //Locally used hooks
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

  useEffect(() => {
    // setEntityCount("1")
    console.log("Overlay is open: ", isOpen)
    switch (true) {
      case entityCount == "0" && Object.keys(someObject).length != 0:
        console.log("someObject is:", someObject)
        console.log("Validating values...")
        handleClick(someObject)
        break
      case entityCount == "0" && Object.keys(someObject).length == 0 && runAddUsers:
        setRunAddUsers(false)
        console.log("Can add user now!")
        func_AddUsers()
        break
      case entityCount != "0" && Object.keys(someObject).length != 0:
        setUserName(extractObjectDetails(someObject, "Full Name"))
        setUserDateOfBirth(extractObjectDetails(someObject, "Date of Birth"))
        setUserHomeAddress(extractObjectDetails(someObject, "Home Address"))
        setRunChangeUserDetails(true)
        setSomeObject({})
        break
      case entityCount != "0" && Object.keys(someObject).keys.length == 0 && runChangeUserDetails:
        setRunChangeUserDetails(false)
        console.log("Can change user details now!")
        func_changeUserDetails()
        break
      default:
        break
    }
  }, [someObject])

  useEffect(() => {
    if (entityCount != "0") {
      console.log("User count is: ", entityCount)
      getPermissionedUserDetails({
        onSuccess: (result) => {
          console.log("Result is: ", result)
          setUserDetails(result as [])
        },
        onError: (error) => {
          console.error(error)
        },
        params: {
          params: { user: account },
        },
      })
    }
  }, [entityCount])

  function shouldValidate() {
    return entityCount == "0" ? true : false
  }

  //Local Components
  const blueButton =
    "mt-4 bg-blue-500 hover:bg-blue-700 text-white font-normal text-2xl py-4 px-8 \
rounded-[50px] w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer"

  function comp_ShowInstructions() {
    return (
      <>
        <div className="mt-4">
          <h2 className="text-2xl font-Inter font-bold underline mb-4">Instructions</h2>
          <ul className="mt-4 ml-5 list-decimal text-left">
            <li>Set-up your KYC details first by filling the form with valid values.</li>
            <li>You need to fill in for your Full Name, Date of Birth and Home Address.</li>
            <li>Once you have filled in the form, click the 'Submit' button to send your KYC details.</li>
            <li>By clicking 'Submit', it will navigate you to Metamask to sign the transaction.</li>
            <li>Once submitted, your KYC detail should show up here.</li>
            <li>
              If your KYC details have been verified once by a trusted party, your <br />
              Unique proof would also be shown here.
            </li>
            <li>If you have a Unique Proof, you can also just use that for faster KYC approval.</li>
          </ul>
        </div>
      </>
    )
  }

  function comp_showKYCDetails() {
    return (
      <>
        <div className="mt-8 mb-4">
          <h2 className="text-2xl font-Inter font-bold underline mb-4">Your KYC details</h2>
          <p className="text-xl font-Inter mb-4">Name: {userDetails[1]} </p>
          <p className="text-xl font-Inter mb-4">Date of Birth: {userDetails[3]}</p>
          <p className="text-xl font-Inter mb-4">Home Address: {userDetails[2]}</p>
        </div>
      </>
    )
  }

  function comp_refreshButton() {
    return (
      <button className={blueButton} onClick={() => router.reload()}>
        Refresh
      </button>
    )
  }

  return (
    // <div className="bg-slate-200">
    <>
      <Overlay isOpen={isOpen} onClose={toggleOverlay} />
      <div className={homeStyles.container}>
        <Head>
          <title>Setup KYC</title>
          <meta name="Setup KYC page" content="This is where you can setup your KYC" />
        </Head>

        <TopElements account={account} />

        <main className={homeStyles.main} style={{ marginTop: "1vh", display: "inline-block" }}>
          <h1 className="text-4xl font-Inter font-bold underline mb-4">Set-up your KYC</h1>
          {entityCount == "0" ? <p>User has not set KYC</p> : <p>User has registered and set KYC!</p>}
          {comp_ShowInstructions()}
          {entityCount == "0" ? <></> : comp_showKYCDetails()}
          <div className="flex flex-col mt-6"></div>
          <div className="mt-2 bg-white rounded-2xl">
            <div className="mt-2 bg-white rounded-2xl w-[500px]">
              <Form
                title={shouldValidate() ? "Set up KYC" : "Change KYC details"}
                id="setupKYC01"
                buttonConfig={{
                  theme: "custom",
                  text: "Submit",
                  customize: { backgroundColor: "#A5F9A4", onHover: "darken", textColor: "black" },
                }}
                data={[
                  {
                    name: "Full Name",
                    type: "text",
                    value: "",
                    inputWidth: "100%",
                    validation: { required: shouldValidate(), regExp: "[a-zA-Z ]+" },
                  },
                  {
                    name: "Date of Birth",
                    type: "date",
                    value: "",
                    validation: { required: shouldValidate() },
                  },
                  {
                    name: "Home Address",
                    type: "textarea",
                    value: "",
                    validation: { required: shouldValidate() },
                  },
                ]}
                onSubmit={setSomeObject} //Note: You can should only set state directly here
                isDisabled={false}
              />
            </div>
          </div>
          {refreshButton ? comp_refreshButton() : <></>}
          <div className="float-right">
            <Link href={"/individualUser_Homepage"}>
              <button className={blueButton}>Go back</button>
            </Link>
            {/* <button className={blueButton} onClick={() => toggleOverlay()}>Open Overlay</button> */}
          </div>
        </main>
      </div>
      {/* </div> */}
    </>
  )
}

export default setupKYC
