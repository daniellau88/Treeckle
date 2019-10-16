import { set } from "date-fns";

// combines js Date with Moment time to form new js Date object
export const parseDateTime = (date, moment) => {
  const time = moment.toDate();
  const values = {
    hours: time.getHours(),
    minutes: time.getMinutes()
  };
};
