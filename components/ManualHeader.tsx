import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react"; //to persist State?

export default function ManualHeader() {
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
    useMoralis();
  const [canCheck, setCanCheck] = useState(false);
  const [accountExist, setAccountExist] = useState(false);

  useEffect(() => {
    console.log("isWeb3Enabled: ", isWeb3Enabled);
    console.log("Account is: ", account);
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);
  //useEffect runs twice because of React strict mode,
  // read React docs for more info

  useEffect(() => {
    if (account) {
      setCanCheck(true);
      setAccountExist(true);
    }
    checkNow();
  }, [account]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        window.localStorage.removeItem("login");
        deactivateWeb3();
        console.log("Null account found. Deactivating web3");
      }
    });
  }, []);

  //Want: Show loading first, then check if variable account exists
  function checkNow() {
    if (!window.localStorage.getItem("login")) setCanCheck(true);
    setTimeout(() => {
      console.log("Checking now...");
      setCanCheck(true);
    }, 1000);
  }

  function connectButton() {
    return (
      <button
        className="
  bg-blue-500 hover:bg-blue-700 text-white font-bold text-[36px] py-2 px-4 rounded-[50px]
  w-[307px] h-[98px]
  "
        onClick={async () => {
          await enableWeb3();
          if (typeof window !== "undefined") {
            window.localStorage.setItem("connected", "inject");
            window.localStorage.setItem("login", "true");
          }
        }}
        disabled={isWeb3EnableLoading}>
        Login
      </button>
    );
  }

  function mainComp() {
    if (account) {
      return <div>You have log in!</div>;
    } else {
      return connectButton();
    }
  }

  return (
    <div>
      {/* {canCheck ? (<div>Yes, you can check now!</div>) : (<div>No, you cannot check now!</div>)} */}
      {canCheck ? mainComp() : <div>Loading...</div>}
    </div>
  );
}
