import React from 'react'
import axios from "axios";
import { Container, Button, Checkbox, Form, Confirm } from 'semantic-ui-react'
import StatusBar from "../../common/StatusBar";
import { Context } from "../../../contexts/UserProvider";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";

const SUCCESS_MSG = "New Room has been successfully made.";
const OVERLAP_CONFLICT_MSG = 
    "This room is has been created already."; 
const UNKNOWN_ERROR_MSG = "An unknown error has occurred. Please try again.";
const otherOption = { text: 'other', value: 'other' }; 
    


class RoomCreationForm extends React.Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = this.getInitialState();

        this.onChange = this.onChange.bind(this);
        this.onSubmitting = this.onSubmitting.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.toggleConfirmation = this.toggleConfirmation.bind(this);
    }

    getInitialState() {
        const initialState = {
            confirming: false,
            roomName: null,
            roomCategory: null,
            options: null,
            roomNewCategory: null,
            roomRecommendedCapacity: null,
            roomContactEmail: null,
            success: false,
            status: null,
            submitting: false
        };
        return initialState;
    }

    resetState() {
        this.setState(this.getInitialState());
    }

    componentDidMount() {
        axios.get('../api/rooms/categories', { headers: { Authorization: `Bearer ${this.context.token}` } })
            .then(res => {
                const categories = res.data.categories;
                const options = [];
                categories.forEach(cat => {
                    const tempData = {
                        text: cat, value: cat
                    };
                    options.push(tempData);
                })
                options.push(otherOption);
                this.setState({ options: options });
            })
            .catch(err => console.log(err));
    }

    // all fields cannot be empty
    areValidFields() {
        return (
            this.state.roomName &&
            (this.state.roomCategory === 'other' ? this.state.roomNewCategory : this.state.roomCategory) &&
            this.state.roomRecommendedCapacity &&
            this.state.roomContactEmail 
        );
    }

    onChange(event, { name, value }) {
        CONSOLE_LOGGING && console.log(`${name} changed:`, value);
        this.setState({ [name]: value });
    }

    async onSubmitting() {
        this.toggleConfirmation();
        this.toggleStatusBar(true);
    }

    handleOnSubmit() {
        this.onSubmitting()
            .then(() => {
                let category; 
                if (this.state.roomCategory === 'other') {
                    category = this.state.roomNewCategory;
                } else {
                    category = this.state.roomCategory;
                }
                const data = {
                    name: this.state.roomName,
                    category: category,
                    recommendedCapacity: this.state.roomRecommendedCapacity,
                    contactEmail: this.state.roomContactEmail
                };
                axios
                    .post("../api/rooms", data, {
                        headers: { Authorization: `Bearer ${this.context.token}` }
                    })
                    .then(response => {
                        CONSOLE_LOGGING && console.log("POST form submission:", response);
                        if (response.status === 200) {
                            this.setState({ success: true });
                            this.renderStatusBar(true, SUCCESS_MSG);
                        }
                    })
                    .catch(({ response }) => {
                        CONSOLE_LOGGING &&
                            console.log("POST form submission error:", response);
                        let msg;
                        switch (response.status) {
                            case 400:
                                msg = OVERLAP_CONFLICT_MSG;
                                break;
                            case 401:
                                alert("Your current session has expired. Please log in again.");
                                this.context.resetUser();
                                break;
                            default:
                                msg = UNKNOWN_ERROR_MSG;
                        }
                        this.renderStatusBar(false, msg);
                    });
            })
            .then(() => {
                this.toggleStatusBar(false);
            });
    }

    toggleConfirmation() {
        this.setState({ confirming: !this.state.confirming });
    }

    toggleStatusBar(submitting) {
        this.setState({ submitting });
    }

    renderStatusBar(success, message) {
        const status = {
            success: success,
            message: message
        };
        this.setState({ status });
        CONSOLE_LOGGING && console.log("Status:", status);
    }

    render() {
        return (
            <Container className="scrollable-table" style={{ padding: "2em" }}>
                {(this.state.status || this.state.submitting) && (
                    <div>
                        <StatusBar
                            status={this.state.status}
                            submitting={this.state.submitting}
                        />
                        <br />
                    </div>
                )}
                <Form>
                    <Form.Input
                        label='Room Name' 
                        onChange={this.onChange}
                        required
                        name='roomName'
                    />
                    <Form.Select
                        options={this.state.options}
                        label='Room Category'
                        onChange={this.onChange}
                        required
                        name='roomCategory'
                    />
                    {(this.state.roomCategory==='other') && (
                        <Form.Input
                            placeholder='New Room Category'
                            onChange={this.onChange}
                            required
                            name='roomNewCategory'
                        />
                    )}
                    <Form.Input
                        type='number'
                        label='Room Recommended Capacity'
                        onChange={this.onChange}
                        required
                        name='roomRecommendedCapacity'
                    />
                    <Form.Input
                        type='email'
                        label='Room Contact Email'
                        onChange={this.onChange}
                        required
                        name='roomContactEmail'
                    />
                    <Button
                        primary
                        fluid
                        disabled={!this.areValidFields() || this.state.success}
                        onClick={this.toggleConfirmation}
                    >
                        Submit
                    </Button>
                    <Confirm
                        open={this.state.confirming}
                        onCancel={this.toggleConfirmation}
                        onConfirm={this.handleOnSubmit}
                        content="Confirm Room Creation?"
                        size="mini"
                    />
                </Form>
            </Container>
        );
    }
}

export default RoomCreationForm;
