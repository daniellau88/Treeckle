/****
 * TODO: CHECK FOR POSSIBLE NAME / CATEGORY COLLISIONS
 */

import React, {useContext, useState, useEffect} from 'react';
import axios from 'axios';
import {Container, Button, Checkbox, Form, Confirm} from 'semantic-ui-react';
import StatusBar from '../../common/StatusBar';
import {Context} from '../../../contexts/UserProvider';
import {CONSOLE_LOGGING} from '../../../DevelopmentView';

const SUCCESS_MSG = 'New Room has been successfully made.';
const OVERLAP_CONFLICT_MSG = 'This room is has been created already.';
const UNKNOWN_ERROR_MSG = 'An unknown error has occurred. Please try again.';
const otherOption = {text: 'other', value: 'other'};

function RoomCreationForm(props) {
  const {token, name, profilePic, role, setUser, resetUser} = useContext(
    Context,
  );
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [options, setOptions] = useState(null);

  const [roomName, setRoomName] = useState('');
  const [roomCategory, setRoomCategory] = useState(null);
  const [roomNewCategory, setRoomNewCategory] = useState('');
  const [roomRecommendedCapacity, setRoomRecommendedCapacity] = useState(-1);
  const [roomContactEmail, setRoomContactEmail] = useState('');

  useEffect(() => {
    axios
      .get('../api/rooms/categories', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        CONSOLE_LOGGING &&
          console.log(`GET req to /api/rooms/categories: `, res.data);
        const categories = res.data.categories;
        const newOptions = [];
        categories.forEach(cat => {
          const tempData = {
            text: cat,
            value: cat,
          };
          newOptions.push(tempData);
        });
        newOptions.push(otherOption);
        setOptions(newOptions);
      })
      .catch(err => console.log(err));
  }, []);

  function resetState() {
    setStatus(null);
    setSubmitting(false);
    setConfirming(false);
    setSuccess(false);
    setRoomName('');
    setRoomCategory(null);
    setRoomNewCategory('');
    setRoomRecommendedCapacity(-1);
    setRoomContactEmail('');
  }

  // all fields cannot be empty
  function areValidFields() {
    return (
      roomName &&
      (roomCategory === 'other' ? roomNewCategory : roomCategory) &&
      roomRecommendedCapacity &&
      roomContactEmail
    );
  }

  async function onSubmitting() {
    toggleConfirmation();
    toggleStatusBar(true);
  }

  function handleOnSubmit() {
    onSubmitting()
      .then(() => {
        let category;
        if (roomCategory === 'other') {
          category = roomNewCategory;
        } else {
          category = roomCategory;
        }
        const data = {
          name: roomName,
          category: category,
          recommendedCapacity: roomRecommendedCapacity,
          contactEmail: roomContactEmail,
        };
        console.log(data);
        axios
          .post('../api/rooms', data, {
            headers: {Authorization: `Bearer ${token}`},
          })
          .then(response => {
            CONSOLE_LOGGING && console.log('POST form submission:', response);
            if (response.status === 200) {
              setSuccess(true);
              renderStatusBar(true, SUCCESS_MSG);
            }
          })
          .catch(({response}) => {
            CONSOLE_LOGGING &&
              console.log('POST form submission error:', response);
            let msg;
            switch (response.status) {
              case 400:
                msg = OVERLAP_CONFLICT_MSG;
                break;
              case 401:
                alert('Your current session has expired. Please log in again.');
                resetUser();
                break;
              default:
                msg = UNKNOWN_ERROR_MSG;
            }
            renderStatusBar(false, msg);
          });
      })
      .then(() => {
        resetState();
        toggleStatusBar(false);
      });
  }

  function toggleConfirmation() {
    setConfirming(!confirming);
  }

  function toggleStatusBar(newSubmitting) {
    setSubmitting(newSubmitting);
  }

  function renderStatusBar(success, message) {
    const newStatus = {
      success: success,
      message: message,
    };
    setStatus(newStatus);
    CONSOLE_LOGGING && console.log('Status:', status);
  }

  return (
    <Container className="scrollable-table" style={{padding: '2em'}}>
      {(status || submitting) && (
        <div>
          <StatusBar status={status} submitting={submitting} />
          <br />
        </div>
      )}
      <Form>
        <Form.Input
          label="Room Name"
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
          required
          name="roomName"
        />
        <Form.Select
          options={options}
          label="Room Category"
          onChange={(e, data) => setRoomCategory(data.value)}
          required
          name="roomCategory"
        />
        {roomCategory === 'other' && (
          <Form.Input
            placeholder="New Room Category"
            value={roomNewCategory}
            onChange={e => setRoomNewCategory(e.target.value)}
            required
            name="roomNewCategory"
          />
        )}
        <Form.Input
          type="number"
          label="Room Recommended Capacity"
          value={roomRecommendedCapacity}
          onChange={e => setRoomRecommendedCapacity(e.target.value)}
          required
          name="roomRecommendedCapacity"
        />
        <Form.Input
          type="email"
          label="Room Contact Email"
          value={roomContactEmail}
          onChange={e => setRoomContactEmail(e.target.value)}
          required
          name="roomContactEmail"
        />
        <Button
          primary
          fluid
          disabled={!areValidFields() || success}
          onClick={toggleConfirmation}>
          Submit
        </Button>
        <Confirm
          open={confirming}
          onCancel={toggleConfirmation}
          onConfirm={handleOnSubmit}
          content="Confirm Room Creation?"
          size="mini"
        />
      </Form>
    </Container>
  );
}

export default RoomCreationForm;
