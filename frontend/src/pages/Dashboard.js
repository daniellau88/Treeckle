import React from "react";
//import sampleSVG from "../images/SampleSVGImage.svg";
//import axios from "axios";
import { Context } from "../contexts/UserProvider";
import { Menu, Container } from "semantic-ui-react";
import ReactGA from "react-ga";
//import { srcToFile } from "../util/ValidationUtil";

class Dashboard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    ReactGA.pageview("/dashboard");
  }
  /*
  componentDidMount() {
    setTimeout(
      srcToFile(sampleSVG, "test.svg", "image/svc").then(function(file) {
        const data = new FormData();
        data.append("profilePicture", file);
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data"
          }
        };
        axios.put("/api/accounts/profilePicture", data, config).catch(err => {
          if (err.response.status === 401) {
            console.log(err.response.status);
            localStorage.clear();
            window.location.reload();
            window.location.replace("/");
            alert("A network error has occurred.");
          }
        });
      }),
      1000
    );
  }
*/
  render() {
    return (
      <main className="dashboard">
        <Menu size="huge" style={{ opacity: 0 }}></Menu>
        <br />
        <br />
        <Container style={{ color: "#FDFDFD" }}>
          <h1>Welcome, {this.context.name}!</h1>
          <h2>Head over to the "Bookings" tab to view/make bookings.</h2>
          <p>
            <strong>Note:</strong> Treeckle is currently in development as part
            of a ​
            <u>
              <strong>
                <a
                  href="https://www.cs3216.com"
                  style={{ color: "#FDFDFD" }}
                  target="_blank"
                >
                  CS3216
                </a>
              </strong>
            </u>{" "}
            Final Project, and we are working hard towards making residential
            life better for you. If you have feedback for us and/or would like
            to have your voice heard in the future of this application, please
            fill up this{" "}
            <u>
              <strong>
                <a
                  href="https://forms.gle/pk9LXadxp1dgDaSD8"
                  style={{ color: "#FDFDFD" }}
                  target="_blank"
                >
                  form
                </a>
              </strong>
            </u>
            .
            <br />
            <br />
            For urgent queries or concerns, please contact us at ​
            <u>
              <strong>
                <a
                  href="mailto:admin@treeckle.com"
                  style={{ color: "#FDFDFD" }}
                >
                  admin@treeckle.com
                </a>
              </strong>
            </u>
            .
          </p>
        </Container>
        <br />
        <br />
        <br />
      </main>
    );
  }
}

export default Dashboard;
