import React from "react";
import ReactGA from "react-ga";
import { Context } from "../../contexts/UserProvider";
import { Container, Menu, Icon, Button } from "semantic-ui-react";
import RoomConfig from "../../components/admin/venue_booking/RoomConfig";
import RoomCreationForm from "../../components/admin/venue_booking/RoomCreationForm";

class RoomsPage extends React.Component {
    static contextType = Context;

    constructor(props) {
        super(props);
        ReactGA.pageview("/admin/rooms");
        this.state = {
            creating: false
        };
    }

    render() {
        return (
            <main> 
                <Menu size="huge"></Menu>
                <br />
                <br />
                <Container>
                    <Button fluid animated="fade" onClick={() => this.setState({ creating: !this.state.creating })}>
                        <Button.Content visible>
                            <Icon name={this.state.creating ? "close" : "add"} />
                        </Button.Content>
                        <Button.Content hidden>
                            {this.state.creating ? "Cancel Room Creation" : "Create New Room"}
                        </Button.Content>
                    </Button>
                    <br />
                    {!this.state.creating && <h1 style={{ color: "#FDFDFD" }}>Configure Rooms</h1>}
                    {!this.state.creating ? <RoomConfig /> : <RoomCreationForm />}
                </Container>
                <br />
                <br />
                <br />
            </main>
        );
    }
}

export default RoomsPage;
