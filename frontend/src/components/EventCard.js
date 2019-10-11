import React, { useState } from 'react'
import { Card, Icon, Image } from 'semantic-ui-react'
import EventModal from '../components/EventModal'

const EventCard = (props) => {

    const [modal, setModal] = useState(false);

    return (
        
        <Card>
            <EventModal open={modal}/>
            <Image onClick={() => setModal(true)} src='http://www.nusinvest.com/wp-content/uploads/2016/03/General-poster.jpg' wrapped ui={false} />
            <Card.Content>
                <Card.Header>{props.name}</Card.Header>
                <Card.Meta>
                    <span className='date'>Joined in 2015</span>
                </Card.Meta>
                <Card.Description>
                    Matthew is a musician living in Nashville.
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <a>
                    <Icon name='user' />
                    22 Friends
                </a>
            </Card.Content>
        </Card>
    );
};

export default EventCard