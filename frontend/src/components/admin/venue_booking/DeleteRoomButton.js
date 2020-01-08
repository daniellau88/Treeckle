import React, {useContext, useState} from 'react';
import axios from 'axios';
import {Context} from '../../../contexts/UserProvider';
import {Confirm, Button, Popup} from 'semantic-ui-react';
import {CONSOLE_LOGGING} from '../../../DevelopmentView';

function DeleteRoomButton(props) {
  const {token, name, profilePic, role, setUser, resetUser} = useContext(
    Context,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function deleteRoom() {
    const data = {
      roomId: props.id,
    };
    axios
      .delete('../api/rooms', {
        data: data,
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(response => {
        CONSOLE_LOGGING && console.log('DELETE room', response);
        if (response.status === 200) {
          props.updateTable();
          toggleConfirmation();
        }
      })
      .catch(({response}) => {
        CONSOLE_LOGGING && console.log('DELETE room error', response);
        if (response.status === 401) {
          alert('Your current session has expired. Please log in again.');
          resetUser();
        }
      });
  }

  function togglePopup() {
    setIsOpen(!isOpen);
  }

  function toggleConfirmation() {
    setConfirming(!confirming);
  }

  return (
    <div>
      <Popup
        trigger={<Button basic color="red" icon="close" />}
        on="click"
        content={
          <Button
            color="red"
            content="Delete Room"
            onClick={toggleConfirmation}
          />
        }
        position="bottom center"
        open={isOpen}
        onOpen={togglePopup}
        onClose={togglePopup}
      />
      <Confirm
        open={confirming}
        onCancel={toggleConfirmation}
        onConfirm={deleteRoom}
        content="Confirm Room Deletion?"
        size="mini"
      />
    </div>
  );
}

export default DeleteRoomButton;
