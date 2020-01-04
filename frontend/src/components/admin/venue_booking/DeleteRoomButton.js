import React from "react";
import axios from "axios";
import { Context } from "../../../contexts/UserProvider";
import { Confirm, Button, Popup } from "semantic-ui-react";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

class DeleteRoomButton extends React.Component {
    static contextType = Context;

    constructor(props) {
        super(props);
        this.state = { 
            isOpen: false, 
            confirming: false 
        };

        this.togglePopup = this.togglePopup.bind(this);
        this.toggleConfirmation = this.toggleConfirmation.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
    }

    deleteRoom() {
        const data = {
            roomId: this.props.id
        };
        axios
            .delete("../api/rooms", {
                data: data,
                headers: { Authorization: `Bearer ${this.context.token}` }
            })
            .then(response => {
                CONSOLE_LOGGING && console.log("DELETE room", response);
                if (response.status === 200) {
                    this.props.updateTable();
                    this.toggleConfirmation();
                }
            })
            .catch(({ response }) => {
                CONSOLE_LOGGING && console.log("DELETE room error", response);
                if (response.status === 401) {
                    alert("Your current session has expired. Please log in again.");
                    this.context.resetUser();
                }
            });
    }

    togglePopup() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    toggleConfirmation() {
        this.setState({ confirming: !this.state.confirming });
    }

    render() {
        return (
            <div>
                <Popup
                    trigger={<Button basic color="red" icon="close" />}
                    on="click"
                    content={
                        <Button color="red" content="Delete Room" onClick={this.toggleConfirmation} /> 
                    }
                    position="bottom center"
                    open={this.state.isOpen}
                    onOpen={this.togglePopup}
                    onClose={this.togglePopup}
                />
                <Confirm
                    open={this.state.confirming}
                    onCancel={this.toggleConfirmation}
                    onConfirm={this.deleteRoom}
                    content="Confirm Room Deletion?"
                    size="mini"
                />
            </div>
        );
    }
}

export default DeleteRoomButton;
