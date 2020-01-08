import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import {Context} from '../../../contexts/UserProvider';
import {Table, Segment, Button} from 'semantic-ui-react';
import DeleteRoomButton from './DeleteRoomButton';
import {CONSOLE_LOGGING} from '../../../DevelopmentView';
import '../../../styles/ScrollableTable.scss';

const OVERLAP_CONFLICT_MSG = 'This room is has been created already.';
const UNKNOWN_ERROR_MSG = 'An unknown error has occurred. Please try again.';

function RoomConfig(props) {
  const {token, name, profilePic, role, setUser, resetUser} = useContext(
    Context,
  );
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateAllCategories();
  }, []);

  function updateAllCategories() {
    axios
      .all([getAllCategories()])
      .then(
        axios.spread(categoriesArr => {
          const newAllCategories = [];
          axios.all([getRoomsData(categoriesArr, newAllCategories)]).then(
            axios.spread(res => {
              newAllCategories.sort((first, second) => {
                if (first.category > second.category) {
                  return 1;
                } else if (first.category < second.category) {
                  return -1;
                } else if (first.name > second.name) {
                  return 1;
                } else {
                  return -1;
                }
              });
              setAllCategories(newAllCategories);
              setIsLoading(false);
            }),
          );
        }),
      )
      .catch(err => {
        const response = err.response;
        CONSOLE_LOGGING && console.log('POST form submission error:', response);
        let msg;
        switch (response.status) {
          case 400:
            alert(OVERLAP_CONFLICT_MSG);
            break;
          case 401:
            alert('Your current session has expired. Please log in again.');
            resetUser();
            break;
          default:
            alert(UNKNOWN_ERROR_MSG);
        }
      });
  }

  function getAllCategories() {
    return axios
      .get('../api/rooms/categories', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        CONSOLE_LOGGING &&
          console.log(`GET request to /api/rooms/categories:`, res);
        return res.data.categories;
      })
      .catch(err => console.log(err));
  }

  function getRoomsData(categoriesArr, resArr) {
    const promiseArr = [];
    categoriesArr.forEach(cat => {
      promiseArr.push(
        axios
          .get(`../api/rooms/categories/${cat}`, {
            headers: {Authorization: `Bearer ${token}`},
          })
          .then(rooms => {
            CONSOLE_LOGGING &&
              console.log(
                `GET request to /api/rooms/categories/${cat}:`,
                rooms,
              );
            const roomsData = rooms.data;
            roomsData.map(room => {
              const {roomId, name, recommendedCapacity, contactEmail} = room;
              resArr.push({
                category: cat,
                roomId,
                name,
                recommendedCapacity,
                contactEmail,
              });
            });
          }),
      );
    });
    return Promise.all(promiseArr);
  }

  function renderBodyRow(data, index) {
    const {category, roomId, name, recommendedCapacity, contactEmail} = data;

    const row = (
      <Table.Row>
        <Table.Cell>{category}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{recommendedCapacity}</Table.Cell>
        <Table.Cell>{contactEmail}</Table.Cell>
        <Table.Cell>
          <DeleteRoomButton id={roomId} updateTable={updateAllCategories} />
        </Table.Cell>
      </Table.Row>
    );
    return row;
  }

  return (
    <div className="scrollable-table" style={{maxHeight: '44em'}}>
      {allCategories.length > 0 ? (
        <Table
          selectable
          headerRow={
            <Table.Row>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Room Name</Table.HeaderCell>
              <Table.HeaderCell>Recommended Capacity</Table.HeaderCell>
              <Table.HeaderCell>Contact Email</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          }
          tableData={allCategories}
          renderBodyRow={renderBodyRow}
        />
      ) : (
        <Segment placeholder textAlign="center" size="huge" loading={isLoading}>
          There are currently no rooms configured
        </Segment>
      )}
    </div>
  );
}

export default RoomConfig;
