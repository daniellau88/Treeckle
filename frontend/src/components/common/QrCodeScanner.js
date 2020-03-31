import React, { useContext } from "react";
import QrReader from "react-qr-reader";
import axios from "axios";
import { CONSOLE_LOGGING } from "../../DevelopmentView";
import { Context } from "../../contexts/UserProvider";

function QrCodeScanner() {
  const user = useContext(Context);

  const handleScan = result => {
    console.log("Result:", result);
    if (result) {
      console.log(result);
    }
  };

  const handleError = err => {
    console.log("Error:", err);
  };

  return <QrReader delay={300} onError={handleError} onScan={handleScan} />;
}

export default QrCodeScanner;
