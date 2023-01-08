import { contractAddresses, abi } from "@web3Constants"
import { useWeb3Contract, useWeb3ExecuteFunction, Web3ExecuteFunctionParameters } from "react-moralis"
// import { ResolveCallOptions } from "node_modules/react-moralis/lib/hooks/internal/_useResolveAsyncCall/index"

//Types
import { contractAddressesInterface } from "@my-types/Web3Interfaces"

// interface web3ResolveCallOptions extends ResolveCallOptions<unknown, Web3ExecuteFunctionParameters> {}

// type readWeb3ContractFunctionsInterface = (params: Web3ExecuteFunctionParameters) => {
//   runContractFunction: ({ throwOnError, onComplete, onError, onSuccess, params: fetchParams, }?: import("node_modules/react-moralis/lib/hooks/internal/_useResolveAsyncCall/index").ResolveCallOptions<unknown, Web3ExecuteFunctionParameters>) => Promise<unknown>;
//   data: unknown;
//   error: Error | null;
//   isFetching: boolean;
//   isLoading: boolean;
// }

// type sth_useWeb3Contract = typeof useWeb3Contract
// interface useWeb3ContractInterface extends sth_useWeb3Contract {}
// interface readWeb3ContractFunctionInterface {
//   runContractFunction: ({ throwOnError, onComplete, onError, onSuccess, params }?: import("node_modules/react-moralis/lib/hooks/internal/_useResolveAsyncCall/index").ResolveCallOptions<unknown, Web3ExecuteFunctionParameters>) => Promise<unknown>;
//   data: unknown;
//   error: Error | null;
//   isFetching: boolean;
//   isLoading: boolean;
// }

function checkDeployment(chainIdHex: string | null) {
  const addresses: contractAddressesInterface = contractAddresses
  const chainId: string = parseInt(chainIdHex!).toString()
  const kycAddress = chainId in addresses ? addresses[chainId][0] : null
  return kycAddress
}

/**
 * 
 * @param chainIdHex - {chainId: chainIdHex} = useMoralis()
 * @param func_useWeb3Contract  - useWeb3Contract
 * @param contractFuncName - name of the function to be called
 * @returns async () runContractFunction, data, error, isFetching, isLoading
 */
function readData(
  chainIdHex: string | null,
  func_useWeb3Contract: typeof useWeb3Contract,
  contractFuncName: string
) {
  const addresses: contractAddressesInterface = contractAddresses
  const chainId: string = parseInt(chainIdHex!).toString()
  const kycAddress = chainId in addresses ? addresses[chainId].slice(-1)[0] : null

  // const { runContractFunction: _ , data} = func_useWeb3Contract({
  //   abi: abi,
  //   contractAddress: kycAddress!,
  //   functionName: contractFuncName,
  //   // params: { user: account },
  // })

  return func_useWeb3Contract({
    abi: abi,
    contractAddress: kycAddress!,
    functionName: contractFuncName,
    // params: { user: account },
  })

  // return {web3Func: _, data}
}

/**
 * 
 * @param chainIdHex - {chainId: chainIdHex} = useMoralis()
 * @param func_useWeb3Contract  - useWeb3ExecuteFunction
 * @param contractFuncName - name of the function to be called
 * @returns async () fetch, data, error, isFetching, isLoading
 */
function writeData(
  chainIdHex: string | null,
  func_useWeb3ExecuteFunction: typeof useWeb3ExecuteFunction,
  contractFuncName: string,
) {
  const addresses: contractAddressesInterface = contractAddresses
  const chainId: string = parseInt(chainIdHex!).toString()
  const kycAddress = chainId in addresses ? addresses[chainId].slice(-1)[0] : null

  return func_useWeb3ExecuteFunction({
    abi: abi,
    contractAddress: kycAddress!,
    functionName: contractFuncName,
    // params: { user: account },
  })
}

export { checkDeployment, readData, writeData }
