import React, { useState, useContext, useEffect } from 'react'
import { Popup, Icon, Image, Button, Header, Modal, Grid, Label, Placeholder, Table } from 'semantic-ui-react'
import axios from "axios";
import { Context } from "../contexts/UserProvider";

const ReviewUsers = props => {
    const user = useContext(Context);

    const [createdAccounts, setCreatedAccounts] = useState(null);
    const [pendingAccounts, setPendingAccounts] = useState(null);
    const [loading, setLoading] = useState(true);

    const headers = {
        Authorization: `Bearer ${user.token}`
    };

    useEffect(() => {
        const fetchData = async () => {
            axios
                .get(
                    "/api/accounts",
                    { headers: headers }
                )
                .then(res => {
                    if (res.status === 200) {
                        setCreatedAccounts(res.data.createdAccounts);
                        setPendingAccounts(res.data.pendingAccounts);
                        console.log(res.data);
                        setLoading(false);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        };
        fetchData();
    }, []);

    const deleteUser = (email) => {
        console.log("deleting " + email);
        axios
            .delete(
                "/api/accounts",
                {
                    email: email
                },
                { headers: headers }
            )
            .then(res => {
                if (res.status === 200) {
                    console.log("deleted");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const makeOrganiser = (person) => {
        console.log("changing " + person);
        axios
            .patch(
                "/api/accounts",
                {
                    name: person.name,
                    email: person.email,
                    role: "Organiser"
                },
                { headers: headers }
            )
            .then(res => {
                if (res.status === 200) {
                    console.log("changed Role");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const makeResident = (person) => {
        console.log("changing " + person);
        axios
            .patch(
                "/api/accounts",
                {
                    name: person.name,
                    email: person.email,
                    role: "Resident"
                },
                { headers: headers }
            )
            .then(res => {
                if (res.status === 200) {
                    console.log("changed Role");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }


    if (loading) {
        return (
            <Table fixed >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Role</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right' >Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            <Placeholder>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Table.Cell>
                        <Table.Cell>
                            <Placeholder>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Table.Cell>
                        <Table.Cell>
                            <Placeholder>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Table.Cell>
                        <Table.Cell>
                            <Placeholder>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        );
    }

    return (
        <Table fixed >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>Role</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right' >Actions</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {createdAccounts.map((value, index) => {
                    return (
                        <Table.Row key={index}>
                            <Table.Cell>
                                {value.name}
                            </Table.Cell>
                            <Table.Cell>{value.email}</Table.Cell>
                            <Table.Cell>{value.role}</Table.Cell>
                            <Table.Cell textAlign='right'>
                                <Popup
                                    trigger={
                                        <Button basic color='green'>
                                            Change Permissions
                                  </Button>
                                    }
                                    content={
                                        <div styles={{textAlign: "center"}}>
                                            <Button color='red' content='Make Organiser' onClick={() => makeOrganiser(value)} />
                                            <br></br>
                                            <Button color='red' content='Make Resident' onClick={() => makeResident(value)} />
                                        </div>
                                    }
                                    on='click'
                                    position='top'
                                />
                                <Popup
                                    trigger={
                                        <Button color='red' icon='close' />
                                    }
                                    content={<Button color='red' content='Delete User' onClick={() => deleteUser(value.email)} />}
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

export default ReviewUsers;
