import React, { useState, useContext } from "react";
import {
  Card,
  Icon,
  Image,
  Button,
  Header,
  Modal,
  Grid,
  Label,
  Container,
  GridRow
} from "semantic-ui-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Axios from "axios";
import { Context } from "../contexts/UserProvider";
import { CONSOLE_LOGGING } from "../DevelopmentView";

const EventCard = props => {
  const curr = props.event;
  const user = useContext(Context);

  const [modal, setModal] = useState(false);
  const [attending, setAttending] = useState(curr.attending);
  const [pax, setPax] = useState(curr.attendees);
  const [isCreator, setCreator] = useState(false);


  const signup = () => {
    setAttending(true);
    console.log(curr.eventId, curr.attending);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    };
    const data = {
      eventId: curr.eventId,
      signUp: 1
    };
    Axios.patch("/api/events/gallery", data, {
      headers
    })
    .then(response => {
      CONSOLE_LOGGING && console.log("PATCH signing up", response);
      if (response.status === 200) {
        setPax(pax + 1);
      }
    })
    .catch(({ response }) => {
      CONSOLE_LOGGING && console.log("PATCH signing up error:", response);
    });
    
  };

  const withdraw = () => {
    setAttending(false);
    //Fire call to withdraw
    setPax(pax - 1);
  }

  //api call to find if he is ownwer of event

  return (
    <Container text="true" style={{ padding: "5px 5px 5px 5px", width: "auto" }}>
      <Card style={{ borderRadius: "1.25rem", overflow: "hidden" }}>
        <Modal
          trigger={
            <Image
              onClick={() => setModal(true)}
              src={curr.image}
              wrapped
              ui={false}
            />
          }
          size="small"
        >
          <Modal.Content>
            <Header>{curr.title}</Header>
            <p>{curr.desc}</p>
            <h5>
              {curr.categories.map((value, index) => {
                return <Label color='teal' tag>
                  {value}
                </Label>
              })}
            </h5>
          </Modal.Content>
        </Modal>
        <Card.Content>
          <Card.Header>{curr.title}</Card.Header>
          <Grid>
            <Grid.Row columns={2} >
              <Grid.Column>
                <Card.Meta>
                  <Icon name="calendar" />
                  <br />
                  <span className="date">{curr.date}</span>
                </Card.Meta>

              </Grid.Column>
              <Grid.Column>
                <Card.Meta>
                  <Icon name="map marker alternate" />
                  <br />
                  <Card.Description>{curr.location}</Card.Description>
                </Card.Meta>

              </Grid.Column>
            </Grid.Row>
          </Grid>
          <br />
          {attending ? (
            <Button fluid="true" as='div' labelPosition='right' onClick={withdraw}>
              <Button fluid basic color='blue'>
                <Icon name='heart' />
                Withdraw
                      </Button>
              <Label basic color='blue' pointing='left' style={{
                "border-bottom-right-radius": "1.1rem",
                "border-top-right-radius": "1.1rem"
              }}>
                {pax}
              </Label>
            </Button>

          ) : (
              <Button fluid="true" as="div" labelPosition="right" onClick={signup}>
                <Button attached="bottom" color="red" fluid="true" stule={{
                  "border-top-left-radius": "1.1rem"
                }}>
                  <Icon name="heart" />
                  Sign up
              </Button>
                <Label basic color="red" pointing="left" style={{ "border-bottom-right-radius": "1.1rem" }}>
                  {pax}
                </Label>
              </Button>
            )}



        </Card.Content>
      </Card>
    </Container>
  );
};

export default EventCard;
