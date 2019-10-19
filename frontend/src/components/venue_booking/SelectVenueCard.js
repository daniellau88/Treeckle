import React from "react";
import { Card, Button, Container, Accordion } from "semantic-ui-react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";

class SelectVenueCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = { categories: [], venues: [], activeButton: "" };

    this.handleOnCategoryClick = this.handleOnCategoryClick.bind(this);
    //this.updateCategory = this.updateCategory.bind(this);
    this.updateActiveButton = this.updateActiveButton.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    Axios.get("api/rooms/categories", {
      headers: { Authorization: `Bearer ${this.context.token}` }
    }).then(response => {
      console.log("GET categories response:", response);
      if (response.status === 200) {
        const categories = response.data.categories.map(category => {
          return {
            key: category,
            title: category,
            content: null
          };
        });
        this.setState({ categories });
        console.log("Categories updated", categories);
      }
    });
  }

  handleOnCategoryClick(event, { active, content }) {
    if (!active) {
      const selectedCategory = content;
      Axios.get(`api/rooms/categories/${selectedCategory}`, {
        headers: { Authorization: `Bearer ${this.context.token}` }
      }).then(response => {
        console.log("GET venues response:", response);
        if (response.status === 200) {
          this.updateCategory(selectedCategory, response.data);
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
    console.log("Categories and venues updated", categories, venues);
  }

  renderVenues(category, venues) {
    const renderedVenues = venues.map(venue => {
      return (
        <Button
          name={venue.roomId}
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

  handleButtonClick(event, { name, category }) {
    this.updateActiveButton(name).then(() =>
      this.updateCategory(category, this.state.venues)
    );
    this.props.renderVenueAvailabilityCard(name);
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content style={{ flexGrow: 0 }}>
          <Card.Header textAlign="center">Select a venue</Card.Header>
        </Card.Content>
        <Card.Content>
          <Accordion
            styled
            panels={this.state.categories}
            onTitleClick={this.handleOnCategoryClick}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default SelectVenueCard;
