import React from "react";
import QrReader from "react-qr-reader";
import axios from "axios";
import { CONSOLE_LOGGING } from "../../DevelopmentView";

function QrCodeScanner() {
  const handleScan = result => {
    console.log("Result:", result);
    if (result) {
      let data = { key: result };
      axios
        .post("../api/sheets", data, {
          headers: { Authorization: `Bearer ${this.context.token}` }
        })
        .then(response => {
          CONSOLE_LOGGING && console.log("POST qrcode submission:", response);
          if (response.status == 200) {
            alert("Successfully registered");
          }
        })
        .catch(error => {
          alert("An unknown error has occurred. Please try again :(");
        });
    }
  };

  const handleError = err => {
    console.log("Error:", err);
  };

  return <QrReader delay={300} onError={handleError} onScan={handleScan} />;
}

export default QrCodeScanner;
