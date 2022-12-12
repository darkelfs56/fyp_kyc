import { NextPage } from "next"

interface Props {
    account: string | null,
    mode: number
}

const TopElements: NextPage<Props> = (props) => {
    const { account, mode } = props;
    return (
        <div className="flex flex-row text-center justify-between">
        <div className="flex mt-[63px]">
          <h1 className="text-4xl font-bold">KYC Blockchain</h1>
        </div>
        <div className="flex flex-col mt-10 mr-4 text-center items-center">
          <svg width={100} height={100}>
            <circle cx={50} cy={50} r={40} fill="red" />
          </svg>
            {account ? (
              <p className="m-[0px]">Address: {account.slice(0,6)+"..."+account.slice(account.length-4)}</p>
            ) : (
              <p className="m-[0px]">Wallet Address</p>
            )}
        </div>
      </div>
    )
}

export default TopElements;