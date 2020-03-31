import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/Treeckle_side.PNG";
//import sampleSVG from "../images/SampleSVGImage.svg";
import { Context } from "../contexts/UserProvider";
import {
  Image,
  Menu,
  Dropdown,
  Icon,
  Label,
  Responsive,
  Sidebar
} from "semantic-ui-react";
import { DEVELOPMENT_VIEW } from "../DevelopmentView";
import { intArrayToBase64 } from "../util/EncodingUtil";
import { CountsContext } from "../contexts/CountsProvider";
//import { srcToFile } from "../util/ValidationUtil";

const getWidth = () => {
  const isSSR = typeof window === "undefined";

  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

class NavigationBar extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = { sidebarOpened: false };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleAdminItemClick = this.handleAdminItemClick.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleItemClick(event, data) {
    this.setState({ activeItem: data.name, sidebarOpened: false });
  }

  handleAdminItemClick(event, data) {
    this.setState({ activeItem: "admin" });
  }

  handleSignOut() {
    this.context.resetUser();
  }

  componentDidMount() {
    this.props.setCounts({ updater: !this.props.counts.updater });
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
        <Responsive
          getWidth={getWidth}
          minWidth={Responsive.onlyComputer.minWidth}
        >
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
            {/* {this.context.role === "Admin" &&
            this.props.counts.pendingRoomBookings >= 0 && (
              <Menu.Item name="admin" active={activeItem === "admin"}>
                <Label text="Admin" color="red" style={{ marginRight: "0" }}>
                  {this.props.counts.pendingRoomBookings}
                </Label>
              </Menu.Item>
            )} */}
            {this.context.role === "Admin" && (
              <Dropdown
                name="admin"
                text="Admin"
                className="link item"
                icon={
                  this.props.counts.pendingRoomBookings >= 0 && (
                    <Label color="red">
                      {this.props.counts.pendingRoomBookings}
                    </Label>
                  )
                }
                options={adminOptions}
                floating
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
        </Responsive>
        <Responsive
          as={Sidebar.Pushable}
          getWidth={getWidth}
          maxWidth={Responsive.onlyTablet.maxWidth}
        >
          <Sidebar
            as={Menu}
            animation="push"
            onHide={() => this.setState({ sidebarOpened: false })}
            vertical
            visible={this.state.sidebarOpened}
          >
            <Menu.Item header>
              <Image
                size="small"
                src={logo}
                as={Link}
                to={"/dashboard"}
                onClick={() => this.setState({ sidebarOpened: false })}
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
            {/* {this.context.role === "Admin" &&
            this.props.counts.pendingRoomBookings >= 0 && (
              <Menu.Item name="admin" active={activeItem === "admin"}>
                <Label text="Admin" color="red" style={{ marginRight: "0" }}>
                  {this.props.counts.pendingRoomBookings}
                </Label>
              </Menu.Item>
            )} */}
            {this.context.role === "Admin" && (
              <Dropdown
                name="admin"
                text="Admin"
                className="link item"
                icon={
                  this.props.counts.pendingRoomBookings >= 0 && (
                    <Label color="red">
                      {this.props.counts.pendingRoomBookings}
                    </Label>
                  )
                }
                options={adminOptions}
                floating
              />
            )}
          </Sidebar>

          <Sidebar.Pusher dimmed={this.state.sidebarOpened}>
            <Menu borderless size="huge">
              <Menu.Item
                onClick={() => this.setState({ sidebarOpened: true })}
                style={{ marginLeft: "1rem" }}
              >
                <Icon name="sidebar" />
              </Menu.Item>

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
          </Sidebar.Pusher>
        </Responsive>
      </div>
    );
  }
}

export default props => (
  <CountsContext.Consumer>
    {({ counts, setCounts }) => (
      <NavigationBar {...props} counts={counts} setCounts={setCounts} />
    )}
  </CountsContext.Consumer>
);
