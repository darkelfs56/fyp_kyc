import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import homeStyles from "../styles/Home.module.css";
import { FormEvent } from "react";

//create a new interface named KYCFormEvent that extends FormEvent
// and has the properties of first and last string
interface KYCForm {
  name: { value: string };
  homeAddress: { value: string };
  dob: { value: string };
}

// Handles the submit event on form submit.
const handleSubmit = async (event: FormEvent) => {
  // Stop the form from submitting and refreshing the page.
  event.preventDefault();
  const target = event.target as typeof event.target & KYCForm;

  // Get data from the form.
  const data = {
    name: target.name.value,
    homeAddress: target.homeAddress.value,
    dob: target.dob.value,
  };

  // Send the data to the server in JSON format.
  const JSONdata = JSON.stringify(data);

  // API endpoint where we send form data.
  const endpoint = "/api/KYCForm";

  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: "POST",
    // Tell the server we're sending JSON.
    headers: {
      "Content-Type": "application/json",
    },
    // Body of the request is the JSON data we created above.
    body: JSONdata,
  };

  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(endpoint, options);

  // Get the response data from server as JSON.
  // If server returns the name submitted, that means the form works.
  const result = await response.json();
  alert(
    `Is this your full details?:\n ${result.data.name}\n ${result.data.homeAddress}\n ${result.data.dob}`
  );
};

const setupKYC: NextPage = () => {
  return (
    <div className={homeStyles.container}>
      <Head>
        <title>Setup KYC</title>
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
          Set-up your KYC
        </h1>
        <div
          style={{
            float: "left",
            width: "100%",
            height: "50vh",
            marginTop: "1rem"
          }}>
          {/* <form action="/api/KYCForm" method="post">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="homeAdress">Home Adress</label>
            <input type="text" id="homeAdress" name="homeAdress" required />

            <label htmlFor="dob">Date of Birth</label>
            <input type="text" id="dob" name="dob" required />

            <button type="submit">Submit</button>
          </form> */}
          <form
            onSubmit={handleSubmit}
            method="post"
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ float: "left" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 0",
                  }}>
                  <label className={homeStyles.formLabel} htmlFor="name">
                    Name:
                  </label>
                  <input
                    className={homeStyles.formInput}
                    type="text"
                    id="name"
                    name="name"
                    required
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 0",
                  }}>
                  <label className={homeStyles.formLabel} htmlFor="homeAddress">
                    Home Address:
                  </label>
                  <textarea
                    className={homeStyles.formInput}
                    id="homeAddress"
                    name="homeAddress"
                    required
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 0",
                  }}>
                  <label className={homeStyles.formLabel} htmlFor="dob">
                    Date of Birth:
                  </label>
                  <input
                    className={homeStyles.formInput}
                    type="text"
                    id="dob"
                    name="dob"
                    required
                  />
                </div>
              </div>

              <div style={{ float: "left", marginLeft: "8vw" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "4px 1rem",
                  }}>
                  <label className={homeStyles.formLabel} htmlFor="name">
                    ID Document
                  </label>
                  <button className={homeStyles.button}>
                    <a href="" className={homeStyles.aButton}>
                      Upload
                    </a>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "auto" }}>
              <a href="#" className={homeStyles.a} style={{}}>
                Return to Home
              </a>
              <button
                type="submit"
                style={{ width: "10vw", backgroundColor: "#A5F9A4", color: "black" }}
                className={homeStyles.button}>
                <a href="" className={homeStyles.aButton}>
                  Confirm
                </a>
              </button>
            </div>
          </form>
        </div>
        {/* <div style={{ float: "left", marginLeft: "8vw" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 1rem",
            }}>
            <label className={homeStyles.formLabel} htmlFor="name">
              ID Document
            </label>
            <button className={homeStyles.button}>
              <a href="" className={homeStyles.aButton}>
                Upload
              </a>
            </button>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default setupKYC;
