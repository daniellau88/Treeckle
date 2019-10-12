import React, { useState } from 'react'
import { Card, Icon, Image, Button, Header, Modal, Grid, Label, Container } from 'semantic-ui-react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const EventCard = (props) => {

    const [modal, setModal] = useState(false);

    const curr = props.event;

    return (

        <Container text="true">
            <Card>

            <Modal trigger={<Image onClick={() => setModal(true)} src={curr.image} wrapped ui={false} />} size="small" >

                <Modal.Content image>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Image wrapped size='medium' src={curr.image} />
                            </Grid.Column>
                            <Grid.Column width={8}>

                                <Header>{curr.title}</Header>
                                <p>
                                    {curr.desc}
                                </p>
                                <h5>
                                    {curr.location} | {curr.date}
                                </h5>
                                <Button fluid="true" as='div' labelPosition='right'>
                                    <Button attached="bottom" color='red' fluid="true">
                                        <Icon name='heart' />
                                        Sign up
                                    </Button>
                                    <Label as='a' basic color='red' pointing='left'>
                                        128
                                    </Label>
                                </Button>
                            </Grid.Column>
                        </Grid.Row>

                    </Grid>



                </Modal.Content>
            </Modal>
            <Card.Content>
                <Card.Header>{curr.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>{curr.date}</span>
                </Card.Meta>
                <Card.Description>
                    {curr.location}
                </Card.Description>
            </Card.Content>
            </Card>
        </Container>
    );
};

export default EventCard