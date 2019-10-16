import { lightFormat, addMinutes, isWithinInterval } from "date-fns";
import { TIME_FORMAT, DAY_MINUTES, TIME_INTERVAL } from "./Constants";

const createAvailabilityOptions = (time = new Date(0, 0), initial = null) => {
  const defaultAvailabilityOptions = [];
  for (let i = 0; i < DAY_MINUTES / TIME_INTERVAL; i++) {
    let period = {
      time: time, // js Date object
      available: initial
    };
    defaultAvailabilityOptions.push(period);
    time = addMinutes(time, TIME_INTERVAL);
  }
  return defaultAvailabilityOptions;
};

const createUserViewAvailabilityOptions = availabilityOptions => {
  return availabilityOptions.map(period => {
    return {
      time: lightFormat(period.time, TIME_FORMAT),
      available: period.available
    };
  });
};

export const getDefaultAvailabilityOptions = () => {
  return createUserViewAvailabilityOptions(createAvailabilityOptions());
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
        available: isWithinInterval(period.time, interval)
          ? false
          : period.available
      };
    });
  }
  return createUserViewAvailabilityOptions(availabilityOptions);
};
