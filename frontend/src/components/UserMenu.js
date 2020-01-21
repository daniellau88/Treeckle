import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Dropdown, Image } from "semantic-ui-react";
import { Context } from "../contexts/UserProvider";
import { intArrayToBase64 } from "../util/EncodingUtil";

function UserMenu(props) {
  const user = useContext(Context);

  const userOptions = [
    <Dropdown.Item
      key="profile"
      as={Link}
      to="/profile"
      text="Profile"
      name="profile"
      icon="user"
      onClick={props.onTabClick}
      active={props.activeTab === "profile"}
    />,
    <Dropdown.Item
      key="sign-out"
      text="Sign Out"
      icon="sign out"
      onClick={user.resetUser}
    />
  ];

  return (
    <Menu.Menu position="right" style={{ marginRight: "1rem" }}>
      <Menu.Item content={<b>{user.name}</b>} />

      <Dropdown
        as={Menu.Item}
        trigger={
          <Image
            size="mini"
            src={`data:image/*;base64,${intArrayToBase64(user.profilePic)}`}
            avatar
            bordered
            style={{ boxShadow: "1px 1px 2px 0 rgba(34,36,38,.85)" }}
          />
        }
        options={userOptions}
        icon={null}
        floating
        active={props.activeTab === "profile"}
      />
    </Menu.Menu>
  );
}

export default UserMenu;
