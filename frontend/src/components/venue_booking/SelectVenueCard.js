import React from "react";
import { Card, Button, Container } from "semantic-ui-react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";

class SelectVenueCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = { categories: [], buttons: [], activeButton: "" };

    this.renderButtons = this.renderButtons.bind(this);
    this.updateActiveButton = this.updateActiveButton.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  componentDidMount() {
    Axios.get("api/rooms/categories", {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(response => {
        if (response.status === 200) {
          console.log("GET categories response:", response);
          this.setState({
            categories: response.data.categories
          });
        }
      })
      .then(this.renderButtons);
  }

  renderButtons() {
    const buttons = this.state.categories.map(category => {
      return (
        <Button
          name={category}
          active={this.state.activeButton === category}
          onClick={this.handleButtonClick}
        >
          <Container type="text">{category}</Container>
        </Button>
      );
    });
    console.log("Rendered categories:", buttons);
    this.setState({ buttons });
  }

  async updateActiveButton(activeButton) {
    this.setState({ activeButton });
  }

  handleButtonClick(event, { name }) {
    this.updateActiveButton(name).then(this.renderButtons);
    this.props.renderVenueAvailabilityCard(name);
  }

  render() {
    return (
      <Card raised style={{ margin: "0 0 1em 0" }}>
        <Card.Content style={{ flexGrow: 0 }}>
          <Card.Header textAlign="center">Select a venue</Card.Header>
        </Card.Content>
        <Card.Content>
          <Button.Group
            vertical
            basic
            fluid
            size="huge"
            buttons={this.state.buttons}
          />
        </Card.Content>
      </Card>
    );
  }
}

export default SelectVenueCard;
