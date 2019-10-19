import { lightFormat, addMinutes, isWithinInterval } from "date-fns";
import { TIME_FORMAT, DAY_MINUTES, TIME_INTERVAL } from "./Constants";

const createAvailabilityOptions = (time = new Date(0, 0), initial = null) => {
  const defaultAvailabilityOptions = [];
  for (let i = 0; i < DAY_MINUTES / TIME_INTERVAL; i++) {
    let period = {
      time: time, // js Date object
      timeFormat: lightFormat(time, TIME_FORMAT), // time in string
      available: initial
    };
    defaultAvailabilityOptions.push(period);
    time = addMinutes(time, TIME_INTERVAL);
  }
  return defaultAvailabilityOptions;
};

export const getUpdatedAvailabilityOptions = (date, bookedSlots) => {
  var availabilityOptions = createAvailabilityOptions(date, true);

  for (let i = 0; i < bookedSlots.length; i++) {
    let interval = {
      start: bookedSlots[i].startDate,
      end: bookedSlots[i].endDate
    };
    availabilityOptions = availabilityOptions.map(period => {
      return {
        time: period.time,
        timeFormat: lightFormat(period.time, TIME_FORMAT),
        available: isWithinInterval(period.time, interval)
          ? false
          : period.available
      };
    });
  }
  return availabilityOptions;
};
