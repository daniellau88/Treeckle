import React from "react";
import EventCard from "./EventCard";
import "./CarousellCards.css";
import { Button } from "semantic-ui-react";

const CarousellCards = () => {
  let ref = React.createRef();

  const handleClick = () => {
    console.log(ref);
    // ref.current.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start',
  };

  const eventOne = {
    title: "Investment",
    desc:
      "For investors paying for each dollar of a company's earnings, the P/E ratio is a significant indicator, but the price-to-book ratio (P/B) is also a reliable indication of how much investors are willing to spend on each dollar of company assets. In the process of the P/B ratio, the share price of a stock is divided by its net assets; any intangibles, such as goodwill, are not taken into account. It is a crucial factor of the price-to-book ratio, due to it indicating the actual payment for tangible assets and not the more difficult valuation of intangibles. Accordingly, the P/B could be considered a comparatively conservative metric.",
    date: "Tues Night",
    location: "Dining Hall",
    image:
      "http://www.nusinvest.com/wp-content/uploads/2016/03/General-poster.jpg"
  };

  const eventTwo = {
    title: "Clubbing",
    desc: "party",
    date: "yesterday Night",
    location: "zouk Hall",
    image:
      "https://weezevent.com/wp-content/uploads/2019/01/12145054/organiser-soiree.jpg"
  };

  const eventThree = {
    title: "Reading",
    desc: "lets read togher",
    date: "tmr Night",
    location: "library hall Hall",
    image:
      "http://www.orlandonorthsports.com/assets/images/placeholders/placeholder-event.png"
  };

  return (
    <div>
      <div class="scrollmenu" id="content">
        <a>
          <EventCard event={eventOne} />
        </a>
        <a>
          <EventCard event={eventTwo} />
        </a>
        <a>
          <EventCard event={eventOne} />
        </a>
        <a>
          <EventCard event={eventThree} />
        </a>
        <a>
          <EventCard event={eventOne} />
        </a>
        <a>
          <EventCard event={eventTwo} ref={ref} />
        </a>
        <a>
          <EventCard event={eventThree} />
        </a>
        <a>
          <EventCard event={eventOne} />
        </a>
      </div>
      <div>
        <Button id="left-button" floated="left" onClick={null}>
          Left
        </Button>
        <Button floated="right" onClick={handleClick}>
          Right
        </Button>
      </div>
    </div>
  );
};

export default CarousellCards;
