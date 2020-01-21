import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Accordion, Label } from "semantic-ui-react";
import { CountsContext } from "../contexts/CountsProvider";

function MobileAdminTab(props) {
  const counts = useContext(CountsContext);
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Accordion as={Menu.Item} fitted="vertically">
      <Accordion.Title
        onClick={() => setExpanded(!isExpanded)}
        active={isExpanded}
      >
        Admin
        {counts.counts.pendingRoomBookings >= 0 && (
          <Label
            color="red"
            content={counts.counts.pendingRoomBookings}
            style={{ marginLeft: "1em" }}
            size="small"
          />
        )}
      </Accordion.Title>
      <Accordion.Content active={isExpanded}>
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

export default MobileAdminTab;
