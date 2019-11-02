import React, { useState, useContext, useEffect } from "react";
import EventCard from "../../../components/EventCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../../components/CarousellCards.css";
import Axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";
import { Card, Container, Label, Icon } from "semantic-ui-react";

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
        getSubscriptions()
    }, []);

    const getSubscriptions = () => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
        };
        Axios.get(
            "/api/events/gallery",
            { headers: headers }
        )
            .then(response => {
                CONSOLE_LOGGING && console.log("GET all events:", response);
                if (response.status === 200) {
                    setAllEvents(response.data);
                    getAllCategories(response.data);
                    setLoading(false);
                    console.log("outside", categories);
                }
            })
            .catch(({ response }) => {
                CONSOLE_LOGGING && console.log("GET all events error:", response);
            });
    };

    const getAllCategories = (responseData) => {
        const temp = new Set();
        responseData.forEach(element => {
            console.log("inside:", element.categories);
            element.categories.forEach(cat => temp.add(cat));
        });
        console.log("temp is ", temp);
        setCategories(temp);
        console.log(temp);
        console.log(categories);

    };

    const addSearch = (cat) => {
        console.log("adding", cat);
        const temp = search;
        temp.add(cat);
        console.log("b4 new search", temp)
        setSearch(temp);
        const temp2 = categories;
        temp2.delete(cat);
        console.log("b4 new cat", temp2)
        setCategories(temp2);
        forceUpdate();
    };

    const removeSearch = (cat) => {
        const temp = categories;
        temp.add(cat);
        setCategories(temp);
        const temp2 = search;
        temp2.delete(cat);
        setSearch(temp2);
        forceUpdate();
    };


    const eventOne = {
        title: "Investment",
        desc:
            "For investors paying for each dollar of a company's earnings, the P/E ratio is a significant indicator, but the price-to-book ratio (P/B) is also a reliable indication of how much investors are willing to spend on each dollar of company assets. In the process of the P/B ratio, the share price of a stock is divided by its net assets; any intangibles, such as goodwill, are not taken into account. It is a crucial factor of the price-to-book ratio, due to it indicating the actual payment for tangible assets and not the more difficult valuation of intangibles. Accordingly, the P/B could be considered a comparatively conservative metric.",
        date: "Tues Night",
        location: "Dining Hall",
        image:
            "http://www.nusinvest.com/wp-content/uploads/2016/03/General-poster.jpg",
        categories: ["test", "cat"],
        eventId: "123",
        attending: false,
        attendees: 0
    };

    const eventTwo = {
        title: "Clubbing",
        desc: "party",
        date: "yesterday Night",
        location: "zouk Hall",
        image:
            "https://weezevent.com/wp-content/uploads/2019/01/12145054/organiser-soiree.jpg",
        categories: ["test", "cat"],
        eventId: "123",
        attending: false,
        attendees: 0
    };

    const eventThree = {
        title: "Reading",
        desc: "lets read togher",
        date: "tmr Night",
        location: "library hall Hall",
        image:
            "http://www.orlandonorthsports.com/assets/images/placeholders/placeholder-event.png",
        categories: ["test", "cat"],
        eventId: "123",
        attending: false,
        attendees: 0
    };


    if (isLoading) {
        return (
            <div>
                <Container>
                    <Card.Group centered="true">
                        <EventCard event={eventOne} />
                        <EventCard event={eventOne} />
                        <EventCard event={eventOne} />
                        <EventCard event={eventTwo} />
                        <EventCard event={eventOne} />
                        <EventCard event={eventOne} />
                        <EventCard event={eventThree} />
                        <EventCard event={eventOne} />
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
                    return <Label key={value} as='a' onClick={() => addSearch(value)} >
                        <Icon name='add' />
                        {value}
                    </Label>
                })}
            </div>
            <br />
            <div>
                <h3>Tags included</h3>
                {[...search].map((value, index) => {
                    return <Label as='a' onClick={() => removeSearch(value)} >
                        {value}
                        <Icon name='delete' />
                    </Label>
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
                            return <EventCard event={{
                                title: value.title,
                                desc: value.description,
                                date: value.eventDate,
                                location: value.venue,
                                image: "/ftp/" + value.posterPath,
                                categories: value.categories,
                                eventId: value.eventId,
                                attending: value.isUserAttendee,
                                attendees: value.attendees
                            }} />
                        } else {
                            return null;
                        }
                    })}
                </Card.Group>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
            </Container>
        </div>
    );
};

export default EventsSubscription;