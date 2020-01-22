import React, { useState, useContext } from "react";
import { Responsive, Sidebar, Menu } from "semantic-ui-react";
import { Context } from "../contexts/UserProvider";
import LogoTab from "./LogoTab";
import DashboardTab from "./DashboardTab";
import EventsTab from "./EventsTab";
import BookingsTab from "./BookingsTab";
import MobileAdminTab from "./MobileAdminTab";
import SidebarButton from "./SidebarButton";
import UserMenu from "./UserMenu";
import { DEVELOPMENT_VIEW } from "../DevelopmentView";
import "../styles/ContainerScrollBar.scss";

function MobileNavigationBar(props) {
  const user = useContext(Context);
  const { getWidth, children, activeTab, setActiveTab } = props;
  const [sidebarOpened, setSidebarOpened] = useState(false);

  const onTabClick = (event, data) => {
    setActiveTab(data.name);
    setSidebarOpened(false);
  };

  return (
    <Responsive
      as={Sidebar.Pushable}
      getWidth={getWidth}
      maxWidth={Responsive.onlyTablet.maxWidth}
      onUpdate={() => {
        getWidth() > Responsive.onlyTablet.maxWidth && setSidebarOpened(false);
      }}
    >
      <Sidebar
        as={Menu}
        animation="push"
        onHide={() => setSidebarOpened(false)}
        vertical
        visible={sidebarOpened}
      >
        <LogoTab onTabClick={onTabClick} />
        <DashboardTab activeTab={activeTab} onTabClick={onTabClick} />
        {DEVELOPMENT_VIEW && (
          <EventsTab activeTab={activeTab} onTabClick={onTabClick} />
        )}
        <BookingsTab activeTab={activeTab} onTabClick={onTabClick} />
        {user.role === "Admin" && (
          <MobileAdminTab activeTab={activeTab} onTabClick={onTabClick} />
        )}
      </Sidebar>

      <Sidebar.Pusher dimmed={sidebarOpened}>
        <Menu borderless size="huge" fixed="top">
          <SidebarButton openSidebar={() => setSidebarOpened(true)} />
          <UserMenu activeTab={activeTab} onTabClick={onTabClick} />
        </Menu>
        <div style={{ height: "100vh", overflow: "auto" }}>{children}</div>
      </Sidebar.Pusher>
    </Responsive>
  );
}

export default MobileNavigationBar;
