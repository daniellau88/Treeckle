import React from "react";
import EventsGallery from "./EventsGallery";
import { Tab, Container } from "semantic-ui-react";
import EventsSubscription from "./EventsSubscription";
import EventsRecommendation from "./EventsRecommendation";

const EventsScene = props => {


  const panes = [
    { menuItem: 'All', render: () => <Tab.Pane><EventsGallery/></Tab.Pane> },
    { menuItem: 'Recommended', render: () => <Tab.Pane><EventsRecommendation/></Tab.Pane> },
    { menuItem: 'Subscriptions', render: () => <Tab.Pane><EventsSubscription/></Tab.Pane> },
  ]

  return (
    <Container>
      <Tab menu={{ attached: false }} panes={panes} />
    </Container>
  );
};

//
export default EventsScene;
