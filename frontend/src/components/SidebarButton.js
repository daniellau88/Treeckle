import React from "react";
import { Menu } from "semantic-ui-react";

function EventsTab(props) {
  return (
    <Menu.Item
      onClick={props.openSidebar}
      icon="sidebar"
      style={{ marginLeft: "1rem" }}
    />
  );
}

export default EventsTab;
