import {
  set,
  lightFormat,
  isFuture,
  isToday,
  isEqual,
  isWithinInterval
} from "date-fns";
import { DATE_FORMAT_DELIMIT_HYPHEN, TIME_FORMAT } from "./Constants";

// combines date from one js Date object with time from
// another js Date object and parses to epoch timestamp.
export const parseDateTime = (date, time) => {
  const values = {
    hours: time.getHours(),
    minutes: time.getMinutes()
  };
  const newDateTime = set(date, values);
  return newDateTime.getTime();
};

// gives the date string representation of js Date object.
export const toDateString = date => {
  return lightFormat(date, DATE_FORMAT_DELIMIT_HYPHEN);
};

// gives the time string representation of js Date object.
export const toTimeString = date => {
  return lightFormat(date, TIME_FORMAT);
};

// gives the date and time string representation of js Date object (milliseconds).
export const toDateTimeString = date => {
  return toDateString(date) + " " + toTimeString(date);
};

// checks if the date is today or in the future.
export const isTodayOrFuture = date => {
  return isToday(date) || isFuture(date);
};

// checks if dateTime is within start and end
export const isWithinIntervalBoundary = (
  dateTime,
  interval,
  isStartInclusive,
  isEndInclusive
) => {
  return (
    isWithinInterval(dateTime, interval) &&
    (isStartInclusive || !isEqual(dateTime, interval.start)) &&
    (isEndInclusive || !isEqual(dateTime, interval.end))
  );
};
