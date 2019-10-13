import React from "react";
import placeholderDP from "../images/avatar.png";
import {
  Grid,
  Header,
  Image,
  Button,
  Segment,
  Responsive,
  Icon,
  Popup
} from "semantic-ui-react";

const ProfileCard = props => (
  <Grid stackable>
    <Grid.Row>
      <Grid.Column computer={4} tablet={8}>
        <Responsive as={Segment} basic minWidth={750}>
          <Popup
            trigger={
              <Image
                src={placeholderDP}
                size="medium"
                circular
                bordered
                style={{ cursor: "pointer" }}
              />
            }
            content={
              <Button animated="fade">
                <Button.Content hidden>
                  <Icon name="camera" />
                </Button.Content>
                <Button.Content visible>Upload Profile Picture</Button.Content>
              </Button>
            }
            on={"click"}
            position="bottom center"
          />
        </Responsive>
      </Grid.Column>

      <Grid.Column computer={12} tablet={8} stretched>
        <Grid columns={1}>
          <Grid.Column stretched>
            <Segment basic compact size="huge">
              <Header size={"huge"}>{props.user.displayName}</Header>
              <p style={{ fontSize: "0.75em", color: "#656565" }}>
                <strong>Email: </strong>
                {props.user.email}
                <br />
                <strong>Role: </strong>
                {props.user.role}
              </p>
            </Segment>
            <Segment basic compact></Segment>
            <Segment basic compact>
              <Button.Group vertical>
                <Button
                  content="View My Bookings"
                  icon="book"
                  labelPosition="left"
                />
                <Button
                  content="View My Events"
                  icon="calendar"
                  labelPosition="left"
                />
              </Button.Group>
            </Segment>
          </Grid.Column>
        </Grid>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default ProfileCard;
