import React from "react";
import { Link } from "react-router-dom";
import { Menu, Image } from "semantic-ui-react";
import logo from "../images/Treeckle_side.PNG";

function LogoTab(props) {
  const data = { name: "dashboard" };

  return (
    <Menu.Item>
      <Image
        size="small"
        src={logo}
        as={Link}
        to={"/dashboard"}
        onClick={() => props.onTabClick(null, data)}
      />
    </Menu.Item>
  );
}

export default LogoTab;
