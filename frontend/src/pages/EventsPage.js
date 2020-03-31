import React, { useState, useContext } from "react";
import { Menu, Container, Button, Icon } from "semantic-ui-react";
import { Context } from "../contexts/UserProvider";
import EventsScene from "../components/user/events/EventsScene";
import EventCreation from "../components/admin/events/EventCreation";

const EventsPage = props => {
  const context = useContext(Context);
  const [creating, setCreating] = useState(false);

  return (
    <main className="events-page">
      <Menu size="huge" style={{ opacity: 0 }}></Menu>
      <br />
      <br />
      {(context.role === "Organiser" || context.role === "Admin") && (
        <Container>
          <Button fluid animated="fade" onClick={() => setCreating(!creating)}>
            <Button.Content visible>
              <Icon name={creating ? "close" : "add"} />
            </Button.Content>
            <Button.Content hidden>
              {creating ? "Cancel event creation" : "Create new event"}
            </Button.Content>
          </Button>
          {!creating && <h1 style={{ color: "#FDFDFD" }}>Events</h1>}
        </Container>
      )}
      {creating ? <EventCreation /> : <EventsScene />}
    </main>
  );
};

export default EventsPage;
