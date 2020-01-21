import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Label, Dropdown } from "semantic-ui-react";
import { CountsContext } from "../contexts/CountsProvider";

function MobileAdminTab(props) {
  const counts = useContext(CountsContext);

  const adminOptions = [
    <Dropdown.Item
      as={Link}
      to="/admin/bookings"
      name="admin/bookings"
      active={props.activeTab === "admin/bookings"}
      text="Bookings"
      onClick={props.onTabClick}
    />,
    <Dropdown.Item
      as={Link}
      to="/admin/users"
      name="admin/users"
      active={props.activeTab === "admin/users"}
      text="Users"
      onClick={props.onTabClick}
    />,
    <Dropdown.Item
      as={Link}
      to="/admin/settings"
      name="admin/settings"
      active={props.activeTab === "admin/settings"}
      text="Settings"
      onClick={props.onTabClick}
    />
  ];

  return (
    <Dropdown
      active={props.activeTab.includes("admin")}
      text="Admin"
      as={Menu.Item}
      icon={
        counts.counts.pendingRoomBookings >= 0 && (
          <Label color="red">{counts.counts.pendingRoomBookings}</Label>
        )
      }
      floating
      options={adminOptions}
    />
  );
}

export default MobileAdminTab;
