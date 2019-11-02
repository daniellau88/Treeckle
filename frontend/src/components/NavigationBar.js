import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/Treeckle_side.PNG";
import { Context } from "../contexts/UserProvider";
import { Image, Menu, Dropdown, Icon } from "semantic-ui-react";
import { DEVELOPMENT_VIEW } from "../DevelopmentView";
import { intArrayToBase64 } from "../util/EncodingUtil";

class NavigationBar extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {};
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleAdminItemClick = this.handleAdminItemClick.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleItemClick(event, data) {
    this.setState({ activeItem: data.name });
  }

  handleAdminItemClick(event, data) {
    this.setState({});
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

    const adminOptions = [
      <Dropdown.Item
        name="bookings"
        text="Bookings"
        as={Link}
        to="/admin/bookings"
        onClick={this.handleAdminItemClick}
      />,
      <Dropdown.Item
        name="users"
        text="Users"
        as={Link}
        to="/admin/users"
        onClick={this.handleAdminItemClick}
      />,
      <Dropdown.Item
        name="settings"
        text="Settings"
        as={Link}
        to="/admin/settings"
        onClick={this.handleAdminItemClick}
      />
      // <Dropdown.Item
      //   name="rooms"
      //   text="Rooms"
      //   as={Link}
      //   to="/admin/rooms"
      //   onClick={this.handleAdminItemClick}
      // />
    ];

    return (
      <div>
        <Menu fixed="top" borderless size="huge">
          <Menu.Item header>
            <Image
              size="small"
              src={logo}
              style={{ marginRight: "0.5rem" }}
              as={Link}
              to={"/dashboard"}
            />
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
            // <Menu.Item
            //   as={Link}
            //   to="/admin"
            //   name="admin"
            //   active={activeItem === "admin"}
            //   content="Admin"
            //   onClick={this.handleItemClick}
            // />
            <Dropdown
              name="admin"
              text="Admin"
              direction="left"
              floating
              className="link item"
              options={adminOptions}
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
            <Menu.Item>
              <b>{this.context.name}</b>
            </Menu.Item>
            <Dropdown
              trigger={
                <Image
                  size="mini"
                  src={`data:image/*;base64,${intArrayToBase64(
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
