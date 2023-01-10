import { NextPage } from "next"
import Link from "next/link"

interface Props {
  /**Should be received from parseInt(React.State entityCount) */
  entityCount: number
}

const blueButton =
  "bg-blue-500 hover:bg-blue-700 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px] hover:cursor-pointer"

const greenButton =
  "bg-[#A5F9A4] hover:bg-green-500 text-white font-normal text-2xl py-4 px-8 rounded-[50px] \
w-fit h-fit w-max-[316px] h-max-[98px] border-[0px]"

/**Shows KYC related button functions to bank/financial institution user.
 * @event If {@link entityCount} is 0, nothing is shown, else show all the buttons.
 * @param {number} entityCount
 */
const BottomElements_BankInstitution: NextPage<Props> = (props) => {
  const { entityCount } = props
  return (
    <>
      {entityCount == 0 ? (
        <></>
      ) : (
        <div className="flex justify-around mt-[320px] content-center items-center">
          <Link href="/crossViewKYC">
            <button className={blueButton}>Cross-View KYCs</button>
          </Link>
          <Link href="/viewKYC">
            <button className={blueButton}>View KYCs Received</button>
          </Link>
        </div>
      )}
    </>
  )
}

export default BottomElements_BankInstitution
