import React from "react";
import axios from "axios"; import { Context } from "../../../contexts/UserProvider"; import { Table, Segment, Button } from "semantic-ui-react"; import StatusButton from "../../common/StatusButton";
import DeleteRoomButton from "./DeleteRoomButton";
import { toDateTimeString } from "../../../util/DateUtil";
import { CONSOLE_LOGGING } from "../../../DevelopmentView";
import "../../../styles/ScrollableTable.scss";

class RoomConfig extends React.Component {
    static contextType = Context;

    constructor(props) {
        super(props);
        this.state = {
            allCategories: [],
            isLoading: true
        };

        this.renderBodyRow = this.renderBodyRow.bind(this);
        this.updateAllCategories = this.updateAllCategories.bind(this);
    }

    componentDidMount() {
        this.updateAllCategories();
    };

    updateAllCategories() {
        axios.all([this.getAllCategories()])
            .then(axios.spread(categoriesArr => {
                const allCategories = [];
                axios.all([this.getRoomsData(categoriesArr, allCategories)])
                    .then(axios.spread(res => {
                        allCategories.sort();
                        this.setState({ 
                            allCategories,
                            isLoading: false
                        });
                    }));
            }))
            .catch(err => console.log(err));
    }

    getAllCategories() {
        return axios.get('../api/rooms/categories', { headers: { Authorization: `Bearer ${this.context.token}` } })
            .then(res => res.data.categories)
            .catch(err => console.log(err));
    }

    getRoomsData(categoriesArr, resArr) {
        const promiseArr = [];
        categoriesArr.forEach(cat => {
            promiseArr.push(axios.get(`../api/rooms/categories/${cat}`, { headers: { Authorization: `Bearer ${this.context.token}` } })
                .then(rooms => {
                    const roomsData = rooms.data;
                    roomsData.map(room => {
                        const {
                            roomId,
                            name,
                            recommendedCapacity,
                            contactEmail
                        } = room;

                        resArr.push({
                            category: cat,
                            roomId,
                            name,
                            recommendedCapacity,
                            contactEmail
                        });
                    });
                }));
        });
        return Promise.all(promiseArr);
    }


    renderBodyRow(data, index) {
        const {
            category,
            roomId,
            name,
            recommendedCapacity,
            contactEmail
        } = data;

        const row = (
            <Table.Row>
                <Table.Cell>{category}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{contactEmail}</Table.Cell>
                <Table.Cell><DeleteRoomButton id={roomId} updateTable={this.updateAllCategories} /></Table.Cell>
            </Table.Row>
        );
        return row;
    }

    render() {
        return (
            <div className="scrollable-table" style={{ maxHeight: "44em" }}>
                {this.state.allCategories.length > 0 ? (
                    <Table
                        selectable
                        headerRow={
                            <Table.Row>
                                <Table.HeaderCell>Category</Table.HeaderCell>
                                <Table.HeaderCell>Room Name</Table.HeaderCell>
                                <Table.HeaderCell>Contact Email</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        }
                        tableData={this.state.allCategories}
                        renderBodyRow={this.renderBodyRow}
                    />
                ) : (
                    <Segment
                        placeholder
                        textAlign="center"
                        size="huge"
                        loading={this.state.isLoading}
                    >
                        There are currently no booking requests
                    </Segment>
                )}
            </div>
        );
    }
}

export default RoomConfig;
