import React from "react";
import { Button, Card, Image, Icon } from "semantic-ui-react";

const CollapsedEventView = props => {
  const curr = props.event;

  return (
    <Card fluid>
      <Card.Content
        style={{
          display: "inline-flex",
          minWidth: "80vw",
          justifyContent: "space-between"
        }}
      >
        <Image
          floated="left"
          //size="mini"
          src={curr.image}
          style={{ margin: "0.5em 0.5em 0.5em 0.5em", width: "5%" }}
        />
        <div style={{ display: "flex-box", margin: "auto 1em" }}>
          <Card.Header>{curr.title}</Card.Header>
          <Card.Meta>{curr.by}</Card.Meta>

          <Card.Description style={{ fontSize: "0.8em" }}>
            <Icon name="calendar" />
            {curr.date} &nbsp;
            <br />
            <Icon name="map marker alternate" />
            {curr.location}
          </Card.Description>
        </div>

        <div
          style={{
            display: "flex-box",
            margin: "0.5em 0.5em 0.5em auto"
          }}
          floated="right"
        >
          <Button basic color="red">
            Delete
          </Button>
          <p
            style={{
              margin: "1em auto 0.5em auto",
              textAlign: "center"
            }}
          >
            <strong>Capacity</strong> <br />
            {curr.currentno} / {curr.capacity}
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CollapsedEventView;
