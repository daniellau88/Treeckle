import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/treekle_logo.png";
import avatar from "../images/avatar.png";
import { Image, Menu, Dropdown, Icon } from "semantic-ui-react";

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(event, data) {
    this.setState({ activeItem: data.name });
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
      <Dropdown.Item name="sign-out" text="Sign Out" icon="sign out" />
    ];

    return (
      <div>
        <Menu size="huge"></Menu>
        <br />
        <Menu fixed="top" borderless size="huge">
          <Menu.Item header>
            <Image size="mini" src={logo} style={{ marginRight: "0.5rem" }} />
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
          <Menu.Item
            as={Link}
            to="/events"
            name="events"
            active={activeItem === "events"}
            content="Events"
            onClick={this.handleItemClick}
          />
          <Menu.Item
            as={Link}
            to="/bookings"
            name="bookings"
            active={activeItem === "bookings"}
            content="Bookings"
            onClick={this.handleItemClick}
          />
          <Menu.Menu position="right" style={{ marginRight: "1rem" }}>
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
            <Dropdown
              trigger={<Image size="mini" src={avatar} avatar />}
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
