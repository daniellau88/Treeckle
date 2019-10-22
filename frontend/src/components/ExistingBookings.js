import React, { useState } from 'react'
import { Popup, Icon, Image, Button, Header, Modal, Grid, Label, Container, Table } from 'semantic-ui-react'

const ExistingBookings = props => {
    const [modal, setModal] = useState(false);

    const bookings = [
        {
            venue: "library",
            start: "today",
            end: "tmr",
            purpose: "study",
            status: true
        },
        {
            venue: "club",
            start: "friday",
            end: "saturday",
            purpose: "party",
            status: false
        }

    ];



    return (
        <Table fixed >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Venue</Table.HeaderCell>
                    <Table.HeaderCell>Start</Table.HeaderCell>
                    <Table.HeaderCell>End</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right' >Status</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {bookings.map((value, index) => {
                    return (
                        <Table.Row key={index}>
                            <Table.Cell>
                                {value.venue}
                            </Table.Cell>
                            <Table.Cell>{value.start}</Table.Cell>
                            <Table.Cell>{value.end}</Table.Cell>
                            <Table.Cell textAlign='right'>
                                {value.status ? (
                                    <Button basic color='green'>
                                        Confirmed
                                  </Button>
                                ) : (
                                        <Button basic color='red'>
                                            Pending
                                    </Button>
                                    )}
                                <Popup
                                    trigger={
                                        <Button  color='red' icon='close' />
                                    }
                                    content={<Button color='red' content='Cancel' />}
                                    on='click'
                                    position='top'
                                />
                            </Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
    );
};

export default ExistingBookings;
