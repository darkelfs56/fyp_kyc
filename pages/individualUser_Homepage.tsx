import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import homeStyles from "../styles/Home.module.css";
import { useMoralis } from "react-moralis";

const individualUser_Homepage: NextPage = () => {
  const { account, Moralis } = useMoralis();

  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Individual User Homepage</title>
        <meta name="Individual User Homepage" content="This is your personal user homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "10px",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>KYC Blockchain</h1>
        </div>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <svg width={100} height={100}>
            <circle cx={50} cy={50} r={40} fill="red" />
          </svg>
          <p style={{ margin: 0 }}>Wallet Address</p>
          <button className={homeStyles.button} style={{marginTop: "1rem"}}>
            <a href="" className={homeStyles.aButton}>
              Notifications
            </a>
          </button>
        </div>
      </div>

      <main className={homeStyles.main} style={{marginTop: "1vh"}}>
        <h1 className={homeStyles.title} style={{ fontSize: "48px" }}>
          WELCOME <br /> Invididual User, walletAddress
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "auto",
          }}
        >
          <button className={homeStyles.button}>
            <a href="" className={homeStyles.aButton}>
              Set up KYC
            </a>
          </button>
          <button className={homeStyles.button} style={{backgroundColor: "#A5F9A4"}}>
            <a href="" className={homeStyles.aButton} style={{color: "black"}}>
              Send KYC
            </a>
          </button>
          <button className={homeStyles.button}>
            <a href="" className={homeStyles.aButton}>
              View sent KYC
            </a>
          </button>
        </div>
      </main>
    </div>
  );
};

export default individualUser_Homepage;
