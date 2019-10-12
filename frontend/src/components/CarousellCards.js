import React, { useState } from "react";
import EventCard from "./EventCard";
import Slider from "react-slick";
import { Grid, Icon, Button } from "semantic-ui-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarousellCards = props => {
  const [slider, setSlider] = useState();

  const previous = () => {
    slider.slickPrev();
  };

  const next = () => {
    slider.slickNext();
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

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div>
      <Grid>
        <Grid.Row>
          <Grid.Column width={1}>
            <Icon onClick={previous} name="angle left" size="huge" />
          </Grid.Column>
          <Grid.Column width={14}>
            <Slider ref={slider => setSlider(slider)} {...settings}>
              <div>
                <h3>
                  <EventCard event={eventOne} />
                </h3>
              </div>
              <div>
                <h3>
                  <EventCard event={eventOne} />
                </h3>
              </div>
              <div>
                <h3>
                  <EventCard event={eventOne} />
                </h3>
              </div>
              <div>
                <h3>
                  <EventCard event={eventOne} />
                </h3>
              </div>
              <div>
                <h3>
                  <EventCard event={eventOne} />
                </h3>
              </div>
              <div>
                <h3>
                  <EventCard event={eventOne} />
                </h3>
              </div>
            </Slider>
          </Grid.Column>
          <Grid.Column width={1}>
            <Icon onClick={next} name="angle right" size="huge" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default CarousellCards;
