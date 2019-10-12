import React from "react";
import { List } from "semantic-ui-react";
import CollapsedEventView from "./CollapsedEventView";

const EventList = () => {
  const eventTwo = {
    title: "NUS Investment Fair",
    desc:
      "For investors paying for each dollar of a company's earnings, the P/E ratio is a significant indicator, but the price-to-book ratio (P/B) is also a reliable indication of how much investors are willing to spend on each dollar of company assets. In the process of the P/B ratio, the share price of a stock is divided by its net assets; any intangibles, such as goodwill, are not taken into account. It is a crucial factor of the price-to-book ratio, due to it indicating the actual payment for tangible assets and not the more difficult valuation of intangibles. Accordingly, the P/B could be considered a comparatively conservative metric.",
    date: "22 Sept 2019",
    location: "Seminar Room 7",
    by: "Investos",
    image:
      "http://www.nusinvest.com/wp-content/uploads/2016/03/General-poster.jpg",
    capacity: "25",
    currentno: "17"
  };
  return (
    <List relaxed>
      <List.Item>
        <CollapsedEventView event={eventTwo} />
      </List.Item>
      <List.Item>
        <CollapsedEventView event={eventTwo} />
      </List.Item>
      <List.Item>
        <CollapsedEventView event={eventTwo} />
      </List.Item>
    </List>
  );
};

export default EventList;
