import { NextPage } from "next"
import Link from "next/link"

interface Props {
  /**Should be received from parseInt(React.State userCount) */
  userCount: number
}

const blueButton =
  "bg-blue-500 hover:bg-blue-700 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer"

const greenButton =
  "bg-[#A5F9A4] hover:bg-green-500 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px]"

/**Shows KYC related button functions to users.
 * @event If {@link userCount} is 0, Set-up KYC becomes green, else Send KYC becomes green.
 * @param {number} userCount
 */
const BottomElements_User: NextPage<Props> = (props) => {
  const { userCount } = props
  return (
    <>
      {userCount == 0 ? (
        <div className="flex justify-around mt-[320px] content-center items-center">
          <Link href="/setupKYC" className="text-black">
            <button className={greenButton}>
              <p className="text-black">Set up KYC</p>
            </button>
          </Link>
          <button className={blueButton} disabled={true}>
            Send KYC
          </button>
          <button className={blueButton} disabled={true}>
            View sent KYC
          </button>
        </div>
      ) : (
        <div className="flex justify-around mt-[320px] content-center items-center">
          <Link href="/setupKYC">
            <button className={blueButton}>Change KYC details</button>
          </Link>
          <button className={greenButton}>
            <Link href="" className="text-black">
              Send KYC
            </Link>
          </button>
          <button className={blueButton}>
            <Link href="">View sent KYC</Link>
          </button>
        </div>
      )}
    </>
  )
}

export default BottomElements_User
