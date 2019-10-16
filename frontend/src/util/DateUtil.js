import { set, lightFormat } from "date-fns";
import { DATE_FORMAT, TIME_FORMAT } from "./Constants";

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
  return lightFormat(date, DATE_FORMAT);
};

// gives the time string representation of js Date object.
export const toTimeString = date => {
  return lightFormat(date, TIME_FORMAT);
};
