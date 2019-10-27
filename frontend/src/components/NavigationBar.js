import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/treeckle_logo.png";
//import sampleSVG from "../images/SampleSVGImage.svg";
//import axios from "axios";
import { Context } from "../contexts/UserProvider";
import { Image, Menu, Dropdown, Icon } from "semantic-ui-react";
import { DEVELOPMENT_VIEW } from "../DevelopmentView";
//import { srcToFile } from "../util/ValidationUtil";

function getBase64IntArray(arr) {
  let TYPED_ARRAY = new Uint8Array(arr);
  const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
  return btoa(STRING_CHAR);
}

class NavigationBar extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  /*
  componentDidMount() {
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
        }
      });
    });
  }
  */

  handleItemClick(event, data) {
    this.setState({ activeItem: data.name });
  }

  handleSignOut() {
    this.context.resetUser();
  }

  render() {
    const { activeItem } = this.state;
    const options = [
      <Dropdown.Item
        name="user"
        text="Profile"
        icon="user"
        as={Link}
        to="/profile"
        onClick={this.handleItemClick}
      />,
      <Dropdown.Item
        name="sign-out"
        text="Sign Out"
        icon="sign out"
        onClick={this.handleSignOut}
      />
    ];

    return (
      <div>
        <Menu fixed="top" borderless size="huge">
          <Menu.Item header>
            <Image
              size="mini"
              src={logo}
              style={{ marginRight: "0.5rem" }}
              as={Link}
              to={"/dashboard"}
            />
            Treeckle
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/dashboard"
            name="dashboard"
            active={activeItem === "dashboard"}
            content="Dashboard"
            onClick={this.handleItemClick}
          />
          {DEVELOPMENT_VIEW && (
            <Menu.Item
              as={Link}
              to="/events"
              name="events"
              active={activeItem === "events"}
              content="Events"
              onClick={this.handleItemClick}
            />
          )}
          <Menu.Item
            as={Link}
            to="/bookings"
            name="bookings"
            active={activeItem === "bookings"}
            content="Bookings"
            onClick={this.handleItemClick}
          />
          {this.context.role === "Admin" && (
            <Menu.Item
              as={Link}
              to="/admin"
              name="admin"
              active={activeItem === "admin"}
              content="Admin"
              onClick={this.handleItemClick}
            />
          )}
          <Menu.Menu position="right" style={{ marginRight: "1rem" }}>
            {DEVELOPMENT_VIEW && (
              <Dropdown
                icon={
                  <Icon
                    name="bell outline"
                    size="large"
                    style={{ margin: "0" }}
                  />
                }
                direction="left"
                floating
                className="link item"
              >
                <Dropdown.Menu>
                  <Dropdown.Item>Notification 1</Dropdown.Item>
                  <Dropdown.Item>Notification 2</Dropdown.Item>
                  <Dropdown.Item>Notification 3</Dropdown.Item>
                  <Dropdown.Item>Notification 4</Dropdown.Item>
                  <Dropdown.Item>Notification 5</Dropdown.Item>
                  <Dropdown.Item>Notification 6</Dropdown.Item>
                  <Dropdown.Item>Notification 7</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            <Dropdown
              trigger={
                <Image
                  size="mini"
                  src={`data:image/jpeg;base64,${getBase64IntArray(
                    this.context.profilePic
                  )}`}
                  avatar
                  bordered
                  style={{ boxShadow: "1px 1px 2px 0 rgba(34,36,38,.85)" }}
                />
              }
              options={options}
              className="link item"
              icon={null}
              direction="left"
              floating
            />
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default NavigationBar;
