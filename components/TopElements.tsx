import { NextPage } from "next"
import { Blockie } from "web3uikit"
import { useRouter } from "next/router"

//Types
interface Props {
  account: string | null
}

/**Shows account's avatar or Blockie, walletAddress and Notifications.
 *@param {string | null} account - Wallet address
 */
const TopElements: NextPage<Props> = (props) => {
  const router = useRouter()
  const { account } = props
  return (
    <div className="flex flex-row text-center justify-between">
      <div className="flex mt-[63px]">
        <h1 className="text-4xl font-bold">KYC Blockchain</h1>
      </div>
      <div className="flex flex-col mt-10 mr-4 text-center items-center">
        {account ? (
          <div>
            <Blockie seed={account as string} size={8} scale={10} />
            <p className="m-[0px] mt-[4px]">
              Address: {account.slice(0, 6) + "..." + account.slice(account.length - 4)}
            </p>
          </div>
        ) : (
          <div>
            <svg width={100} height={100}>
              <circle cx={50} cy={50} r={40} fill="red" />
            </svg>
            <p className="m-[0px]">Wallet Address</p>
          </div>
        )}
        {router.pathname == "/" ? (
          <div></div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-normal text-2xl py-2 px-4 mt-4 rounded-[50px]
              p-10">
            <a href="">Notifications</a>
          </button>
        )}
      </div>
    </div>
  )
}

export default TopElements
