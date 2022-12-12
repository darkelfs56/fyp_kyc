import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

//CSS
import styles from "../styles/Home.module.css";

//Components
import ManualHeader from "../components/ManualHeader";
import Header from "../components/Header";
import Notification from "../components/Notification";
import KYCEntrance from "../components/KYCEntrance";
import TopElements from "../components/TopElements";

//remember to install react-moralis package, rather than
// using pure ether.js
//-> yarn add moralis react-moralis

const Home: NextPage = () => {
  const { account, Moralis } = useMoralis();
  const router = useRouter();
  const [accountExists, setAccountExists] = useState(false);

  useEffect(() => {
    if (account) {
      setAccountExists(true);
    }
  }, [account]);

  useEffect(() => {
    if (accountExists) {
      setTimeout(() => {
      router.push("/individualUser_Homepage");
      }, 2000);
    }
  }, [accountExists]);

  return (
    <div className={styles.container}>
      <Head>
        <title>KYC Blockchain</title>
        <meta
          name="description"
          content="A KYC website that integrates with blockchain technology"
        />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {/* <ManualHeader/> */}
      {/* <Header /> */}
      {/* <Notification /> */}
      {/* <KYCEntrance /> */}

      
      <TopElements account={account} mode={0} />

      <main className={styles.main} style={{ alignItems: "center", marginTop: "10vh" }}>
        <h1 className={styles.title}>
          WELCOME <br /> to the system
        </h1>
        <ManualHeader />
        {accountExists ? (<div>Redirecting to your account page...</div>) : (<div></div>)}
        <a href="https://metamask.io/" target={"_blank"} style={{ textDecorationLine: "underline" }} className={styles.a}>
          You don't have metamask?
        </a>
      </main>
    </div>
  );
};

export default Home;

//Was previous "Login button"
{
  /* <button
  style={{
    backgroundColor: "#A5F9A4",
    borderColor: "green",
    borderRadius: "50px",
    borderWidth: "0px",
    width: "307px",
    height: "98px",
  }}
  className={styles.button}>
  <a href="/" style={{ fontSize: "36px", color: "black" }} className={styles.aButton}>
    Login
  </a>
</button>; */
}
