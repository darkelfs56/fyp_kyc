import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import homeStyles from "../styles/Home.module.css";
import { FormEvent } from "react";

const sendKYC: NextPage = () => {
  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Send KYC</title>
        <meta name="Setup KYC page" content="This is where you can setup your KYC" />
      </Head>

      <div style={{ display: "inline-block", float: "left", marginTop: "10px" }}>
        <h1>KYC Blockchain</h1>
      </div>

      <div
        style={{
          display: "inline-block",
          float: "right",
          marginTop: "10px",
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <svg width={100} height={100}>
            <circle cx={50} cy={50} r={40} fill="red" />
          </svg>
          <p style={{ margin: 0 }}>Wallet Address</p>
          <button className={homeStyles.button} style={{ marginTop: "1rem" }}>
            <a href="" className={homeStyles.aButton}>
              Notifications
            </a>
          </button>
        </div>
      </div>

      <main className={homeStyles.main} style={{ marginTop: "1vh", display: "inline-block" }}>
        <h1
          className={homeStyles.title}
          style={{
            fontSize: "48px",
            textDecoration: "underline",
            textAlign: "left",
          }}>
          Send your KYC
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <p style={{ fontSize: "20px" }}>Bank/Financial Institution wallet address</p>
          <form
            action=""
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              width: "100%",
            }}>
            <input
              type="text"
              id="bankWalletAddress"
              name="bankWalletAddress"
              required
              style={{ width: "20vw", height: "3vh" }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "3rem",
                justifyContent: "center",
                gap: "2rem",
                width: "100%",
              }}>
              <button
                style={{ width: "15vw", backgroundColor: "#A5F9A4", color: "black" }}
                className={homeStyles.button}>
                <a href="" className={homeStyles.aButton} style={{ fontSize: "20px" }}>
                  Send Unique Proof
                </a>
              </button>
              <button
                type="submit"
                style={{ width: "15vw", backgroundColor: "#A5F9A4", color: "black" }}
                className={homeStyles.button}>
                <a href="" className={homeStyles.aButton} style={{ fontSize: "20px" }}>
                  Give KYC access
                </a>
              </button>
            </div>
          </form>
        </div>

        <a href="#" className={homeStyles.a} style={{position: "absolute", bottom: "2rem"}}>
          Return to Home
        </a>
      </main>
    </div>
  );
};

export default sendKYC;
