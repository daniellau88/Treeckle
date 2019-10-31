import React from "react";
import { Card, Button, Container, Accordion, Segment } from "semantic-ui-react";
import axios from "axios";
import { Context } from "../../../../contexts/UserProvider";
import { CONSOLE_LOGGING } from "../../../../DevelopmentView";

class SelectVenueCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      venues: [],
      activeButton: "",
      isLoading: true
    };

    this.handleOnCategoryClick = this.handleOnCategoryClick.bind(this);
    this.updateActiveButton = this.updateActiveButton.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    axios
      .get("api/rooms/categories", {
        headers: { Authorization: `Bearer ${this.context.token}` }
      })
      .then(response => {
        CONSOLE_LOGGING && console.log("GET categories response:", response);
        if (response.status === 200) {
          const categories = response.data.categories.map(category => {
            return {
              key: category,
              title: category,
              content: null
            };
          });
          this.setState({ categories, isLoading: false });
          CONSOLE_LOGGING && console.log("Categories updated", categories);
        }
      })
      .catch(({ response }) => {
        CONSOLE_LOGGING && console.log("GET categories error:", response);
        if (response.status === 401) {
          alert("Your current session has expired. Please log in again.");
          this.context.resetUser();
        }
      });
  }

  handleOnCategoryClick(event, { active, content }) {
    if (!active) {
      const selectedCategory = content;
      axios
        .get(`api/rooms/categories/${selectedCategory}`, {
          headers: { Authorization: `Bearer ${this.context.token}` }
        })
        .then(response => {
          CONSOLE_LOGGING && console.log("GET venues response:", response);
          if (response.status === 200) {
            this.updateCategory(selectedCategory, response.data);
          }
        })
        .catch(({ response }) => {
          CONSOLE_LOGGING && console.log("GET venues error:", response);
          if (response.status === 401) {
            alert("Your current session has expired. Please log in again.");
            this.context.resetUser();
          }
        });
    }
  }

  updateCategory(selectedCategory, venues) {
    const renderedVenues = this.renderVenues(selectedCategory, venues);
    const categories = this.state.categories.map(category => {
      return selectedCategory !== category.key
        ? category
        : {
            key: category.key,
            title: category.title,
            content: renderedVenues
          };
    });
    this.setState({ categories, venues });
    CONSOLE_LOGGING &&
      console.log("Categories and venues updated", categories, venues);
  }

  renderVenues(category, venues) {
    const renderedVenues = venues.map(venue => {
      return (
        <Button
          roomId={venue.roomId}
          venue={venue}
          active={this.state.activeButton === venue.roomId}
          onClick={this.handleButtonClick}
          category={category}
        >
          <Container>{venue.name}</Container>
        </Button>
      );
    });
    return {
      content: <Button.Group vertical basic fluid buttons={renderedVenues} />
    };
  }

  async updateActiveButton(activeButton) {
    this.setState({ activeButton });
  }

  handleButtonClick(event, data) {
    const { roomId, venue, category } = data;
    this.updateActiveButton(roomId).then(() =>
      this.updateCategory(category, this.state.venues)
    );
    this.props.renderVenueAvailabilityCard(venue);
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content style={{ flexGrow: 0 }}>
          <Card.Header textAlign="center">Select a venue</Card.Header>
        </Card.Content>
        <Card.Content style={{ flexGrow: 0 }}>
          {this.state.isLoading ? (
            <Segment style={{ boxShadow: "none" }} placeholder loading />
          ) : (
            <Accordion
              styled
              panels={this.state.categories}
              onTitleClick={this.handleOnCategoryClick}
            />
          )}
        </Card.Content>
      </Card>
    );
  }
}

export default SelectVenueCard;
