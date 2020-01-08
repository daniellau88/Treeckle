import React, {useState} from "react";
import ReactGA from "react-ga";
import { Container, Menu, Icon, Button } from "semantic-ui-react";
import RoomConfig from "../../components/admin/venue_booking/RoomConfig";
import RoomCreationForm from "../../components/admin/venue_booking/RoomCreationForm";

function RoomsPage(props) { 
    ReactGA.pageview("/admin/rooms");
    const [creating, setCreating] = useState(false);

    return (
        <main> 
            <Menu size="huge"></Menu>
            <br />
            <br />
            <Container>
                <Button fluid animated="fade" onClick={(e) => setCreating(!creating)}>
                    <Button.Content visible>
                        <Icon name={creating ? "close" : "add"} />
                    </Button.Content>
                    <Button.Content hidden>
                        {creating ? "Cancel Room Creation" : "Create New Room"}
                    </Button.Content>
                </Button>
                <br />
                {creating && <h1 style={{ color: "#FDFDFD" }}>Configure Rooms</h1>}
                {creating ? <RoomCreationForm /> : <RoomConfig />}
            </Container>
            <br />
            <br />
            <br />
        </main>
    );
}

export default RoomsPage;
