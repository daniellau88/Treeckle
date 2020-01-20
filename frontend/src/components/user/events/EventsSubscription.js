import React, { useState, useContext, useEffect, Fragment } from "react";
import EventCard from "../../../components/EventCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../components/CarousellCards.css";
import Axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";
import { Card, Container, Label, Icon, Placeholder } from "semantic-ui-react";
import _ from "lodash";

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(true); //boolean state
  return () => setValue(!value); // toggle the state to force render
}

const EventsSubscription = () => {
  const user = useContext(Context);

  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState(new Set());
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState(new Set());

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    getSubscriptions();
  }, []);

  const getSubscriptions = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    };
    Axios.get("/api/events/gallery", { headers: headers })
      .then(response => {
        CONSOLE_LOGGING && console.log("GET all events:", response);
        if (response.status === 200) {
          setAllEvents(response.data);
          getAllCategories(response.data);
          setLoading(false);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("GET all events error:", response);
      });
  };

  const getAllCategories = responseData => {
    const temp = new Set();
    responseData.forEach(element => {
      element.categories.forEach(cat => temp.add(cat));
    });
    initialiseSearch(temp);
  };

  const addSearch = cat => {
    const temp = search;
    temp.add(cat);
    setSearch(temp);
    const temp2 = categories;
    temp2.delete(cat);
    setCategories(temp2);
    forceUpdate();
    updateUserCatToServer();
  };

  const updateUserCatToServer = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    };
    const data = {
      subscribedCategories: [...search]
    };
    Axios.patch("/api/events/gallery/categories", data, {
      headers
    })
      .then(response => {
        CONSOLE_LOGGING && console.log("PATCH update categories", response);
        if (response.status === 200) {
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING &&
          console.log("PATCH update categories error:", response);
      });
  };

  const removeSearch = cat => {
    const temp = categories;
    temp.add(cat);
    setCategories(temp);
    const temp2 = search;
    temp2.delete(cat);
    setSearch(temp2);
    forceUpdate();
    updateUserCatToServer();
  };

  const initialiseSearch = allCats => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`
    };
    Axios.get("/api/events/gallery/categories", { headers: headers })
      .then(response => {
        CONSOLE_LOGGING && console.log("GET old categories:", response);
        if (response.status === 200) {
          let firstSearch = new Set();
          response.data.forEach(x => {
            console.log(allCats, x);

            if (allCats.has(x)) {
              firstSearch.add(x);
              allCats.delete(x);
              console.log("adding search", x);
            }
          });
          setCategories(allCats);
          setSearch(firstSearch);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("GET old categories:", response);
      });
  };

  if (isLoading) {
    return (
      <div>
        <Container>
          <Card.Group doubling itemsPerRow={3} centered>
            {_.map([1, 2, 3], card => (
              <Card key={card.header}>
                <Placeholder>
                  <Placeholder.Image square />
                </Placeholder>
                <Card.Content>
                  <Placeholder>
                    <Placeholder.Header>
                      <Placeholder.Line length="very short" />
                      <Placeholder.Line length="medium" />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                      <Placeholder.Line length="short" />
                    </Placeholder.Paragraph>
                  </Placeholder>
                  <Fragment>
                    <Card.Header>{card.header}</Card.Header>
                    <Card.Meta>{card.date}</Card.Meta>
                    <Card.Description>{card.description}</Card.Description>
                  </Fragment>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      </div>
    );
  }
  return (
    <div>
      <div>
        <h3>Tags excluded</h3>
        {[...categories].map((value, index) => {
          return (
            <Label key={value} as="a" onClick={() => addSearch(value)}>
              <Icon name="add" />
              {value}
            </Label>
          );
        })}
      </div>
      <br />
      <div>
        <h3>Tags included</h3>
        {[...search].map((value, index) => {
          return (
            <Label as="a" onClick={() => removeSearch(value)}>
              {value}
              <Icon name="delete" />
            </Label>
          );
        })}
      </div>

      <Container>
        <Card.Group centered="true">
          {allEvents.map((value, index) => {
            let canInclude = false;
            value.categories.forEach(cat => {
              if (search.has(cat)) {
                canInclude = true;
              }
            });
            if (canInclude) {
              return (
                <EventCard
                  event={{
                    title: value.title,
                    desc: value.description,
                    date: value.eventDate,
                    location: value.venue,
                    image: "/ftp/" + value.posterPath,
                    categories: value.categories,
                    eventId: value.eventId,
                    attending: value.isUserAttendee,
                    attendees: value.attendees
                  }}
                />
              );
            } else {
              return null;
            }
          })}
        </Card.Group>
        <br />
        <br />
        <br />
        <br />
        <br />
      </Container>
    </div>
  );
};

export default EventsSubscription;
