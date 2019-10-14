import React from "react";
import { Card, Button, Container } from "semantic-ui-react";
import Axios from "axios";
import { Context } from "../../contexts/UserProvider";

class SelectVenueCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = { categories: [], buttons: [], activeButton: "" };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  handleButtonClick(event, data) {
    this.setState({ activeButton: data.name });
    this.props.renderVenueAvailabilityCard(data.name);
  }

  componentDidMount() {
    Axios.get("api/rooms/categories", {
      headers: { Authorization: `Bearer ${this.context.token}` }
    })
      .then(response => {
        if (response.status === 200) {
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
    this.setState({ buttons });
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
