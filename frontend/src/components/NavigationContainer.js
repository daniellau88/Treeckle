import React, { useState } from "react";
import PropTypes from "prop-types";
import { Responsive } from "semantic-ui-react";
import MobileNavigationBar from "./MobileNavigationBar";
import DesktopNavigationBar from "./DesktopNavigationBar";

function NavigationContainer({ children }) {
  const [activeTab, setActiveTab] = useState("");

  const getWidth = () => {
    const isSSR = typeof window === "undefined";

    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
  };

  return (
    <div>
      <DesktopNavigationBar
        getWidth={getWidth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {children}
      </DesktopNavigationBar>
      <MobileNavigationBar
        getWidth={getWidth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {children}
      </MobileNavigationBar>
    </div>
  );
}

NavigationContainer.propTypes = {
  children: PropTypes.node
};

export default NavigationContainer;
