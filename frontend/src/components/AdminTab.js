import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Accordion, Label } from "semantic-ui-react";
import { CountsContext } from "../contexts/CountsProvider";

function AdminTab(props) {
  const counts = useContext(CountsContext);

  return (
    <Accordion as={Menu.Item} active={props.activeTab.includes("admin")}>
      <Accordion.Title
        content="Admin"
        icon={
          counts.counts.pendingRoomBookings >= 0 && (
            <Label color="red" content={counts.counts.pendingRoomBookings} />
          )
        }
      />
      <Accordion.Content>
        <Menu.Item
          as={Link}
          to="/admin/bookings"
          name="admin/bookings"
          active={props.activeTab === "admin/bookings"}
          content="Bookings"
          onClick={props.onTabClick}
        />
        <Menu.Item
          as={Link}
          to="/admin/users"
          name="admin/users"
          active={props.activeTab === "admin/users"}
          content="Users"
          onClick={props.onTabClick}
        />
        <Menu.Item
          as={Link}
          to="/admin/settings"
          name="admin/settings"
          active={props.activeTab === "admin/settings"}
          content="Settings"
          onClick={props.onTabClick}
        />
      </Accordion.Content>
    </Accordion>
  );
}

export default AdminTab;
