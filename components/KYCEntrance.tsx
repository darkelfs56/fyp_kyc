import { useWeb3Contract } from "react-moralis";
import { contractAddresses, abi } from "@web3Constants";
import { contractAddressesInterface } from "@my-types/Web3Interfaces";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers, ContractTransaction } from "ethers";
import { useNotification, Bell } from "web3uikit";

//Reference based on:
//https://github.com/PatrickAlphaC/nextjs-smartcontract-lottery-fcc/blob/typescript/components/LotteryEntrance.tsx

export default function KYCEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const addresses: contractAddressesInterface = contractAddresses
  const chainId: string = parseInt(chainIdHex!).toString()
  const kycAddress = chainId in contractAddresses ? addresses[chainId][0] : null
  const { runContractFunction: getOwner } = useWeb3Contract({
    abi: abi,
    contractAddress: kycAddress!,
    functionName: "getOwner",
    params: {},
  });

  const [owner, setOwner] = useState("0");

  const dispatch = useNotification();

  const handleSuccess = async function(tx: ContractTransaction) {
    console.log("tx is type of: ", typeof(tx))
    try {await tx?.wait(1)} catch (error) {console.log(error)};
    handleNewNotification();
  }

  const handleNewNotification = function(){
    dispatch({
      title: "Get owner address",
      message: "Successfully retrieved contract owner address.",
      type: "info",
      position: "topR",
      icon: <Bell />,
    });
  }

  async function updateUI() {
    const owner = (await getOwner({
      onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
      onError: (error) => console.error(error),
    })) as string;
    console.log("Owner is:\n", owner);
    setOwner(owner);
  }

  //   useEffect(() => {
  //     if (isWeb3Enabled) {
  //       updateUI();
  //       console.log(chainId);
  //     }
  //   }, [isWeb3Enabled]); //add it here, to check when it is true

  return (
    <>
      <h1 className="text-3xl font-bold underline">Hi from KYC Entrance!</h1>
      {kycAddress ? (
        <div>
          Owner is: {owner} <br />
          <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async function () {
              if (isWeb3Enabled) await updateUI();
              else setOwner("Cannot get owner address.");
            }}>
            Get owner address
          </button>
        </div>
      ) : (
        <div>KYC Contract not deployed on this network.</div>
      )}
    </>
  );
}
