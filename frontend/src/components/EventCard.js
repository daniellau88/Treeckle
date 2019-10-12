import React, { useState } from 'react'
import { Card, Icon, Image, Button, Header, Modal } from 'semantic-ui-react'
import { tsPropertySignature } from '@babel/types';

const EventCard = (props) => {

    const [modal, setModal] = useState(false);

    const curr = props.event;

    return (

        <Card>
            
            <Modal trigger={<Image onClick={() => setModal(true)} src={curr.image} wrapped ui={false} />} basic>
                <Modal.Content image>
                    <Image wrapped size='medium' src={curr.image} />
                    <Modal.Description>
                        <Header>{curr.title}</Header>
                        <p>
                            {curr.desc}
                        </p>
                        <h5>
                            {curr.location}
                        </h5>
                    </Modal.Description>

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
    );
};

export default EventCard