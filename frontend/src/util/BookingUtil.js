import { lightFormat, addMinutes, isAfter, isSameDay } from "date-fns";
import { TIME_FORMAT, DAY_MINUTES, TIME_INTERVAL } from "./Constants";
import { isWithinIntervalBoundary } from "./DateUtil";

const createAvailabilityOptions = (time = new Date(0, 0), initial = null) => {
  const defaultAvailabilityOptions = [];
  for (let i = 0; i < DAY_MINUTES / TIME_INTERVAL; i++) {
    let period = {
      time: time, // js Date object
      timeFormat: lightFormat(time, TIME_FORMAT), // time in string
      available: initial
    };
    time = addMinutes(time, TIME_INTERVAL);
    defaultAvailabilityOptions.push(period);
  }
  return defaultAvailabilityOptions;
};

export const getUpdatedAvailabilityOptions = (
  date,
  startDateTime,
  bookedSlots
) => {
  var availabilityOptions = createAvailabilityOptions(date, true);

  const isStart = startDateTime === null;

  for (let i = 0; i < bookedSlots.length; i++) {
    let interval = {
      start: bookedSlots[i].startDate,
      end: bookedSlots[i].endDate
    };
    availabilityOptions = availabilityOptions.map(period => {
      return {
        time: period.time,
        timeFormat: lightFormat(period.time, TIME_FORMAT),
        available: isWithinIntervalBoundary(
          period.time,
          interval,
          isStart,
          !isStart
        )
          ? false
          : period.available
      };
    });
  }

  if (isSameDay(startDateTime, date)) {
    availabilityOptions = availabilityOptions.filter(period => {
      return isAfter(period.time, startDateTime);
    });
  }
  return availabilityOptions;
};
