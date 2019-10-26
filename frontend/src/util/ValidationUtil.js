import sampleSVG from "../images/SampleSVGImage.svg";
import axios from "axios";

export function srcToFile(src, fileName, mimeType) {
  return fetch(src)
    .then(function(res) {
      return res.arrayBuffer();
    })
    .then(function(buf) {
      return new File([buf], fileName, { type: mimeType });
    });
}

export async function validateUser(token) {
  let result = true;
  srcToFile(sampleSVG, "test.svg", "image/svc").then(function(file) {
    const data = new FormData();
    data.append("profilePicture", file);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    };
    axios.put("/api/accounts/profilePicture", data, config).catch(err => {
      console.log(err.response.status);
      if (err.response.status === 401) {
        result = false;
      } else {
        result = true;
      }
    });
    return result;
  });
}
