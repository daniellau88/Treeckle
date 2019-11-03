import React, {createContext, useState, useEffect, useContext} from 'react';
import { Context } from '../contexts/UserProvider';
import axios from 'axios';
import { CONSOLE_LOGGING } from '../DevelopmentView';

export const CountsContext = createContext();

const CountsContextProvider = (props) => {
    const [counts, setCounts] = useState({
        pendingRoomBookings: 0,
        updater: false,
        runOnce: false
    });

    const userContext = useContext(Context);

    useEffect(() => {
        if (userContext.token) {
            updatePendingRoomBookings();
        }
    }, [counts.pendingRoomBookings, counts.updater]);

    const updatePendingRoomBookings = () => {
        axios.get('/api/rooms/bookings/all/count', {headers: { Authorization: `Bearer ${userContext.token}`}})
        .then(response => {
            if (counts.pendingRoomBookings !== response) {
                setCounts({ pendingRoomBookings: response.data });
            }
        })
        .catch(err => {CONSOLE_LOGGING && console.log(err)});
      }

    return (
        <CountsContext.Provider value={{counts, setCounts}}>
            { props.children }
        </CountsContext.Provider>
    )
}

export default CountsContextProvider;