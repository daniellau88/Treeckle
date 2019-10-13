import React from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import "../../styles/DatePicker.scss";

const DatePicker = props => {
  return (
    <SemanticDatepicker
      clearable
      allowOnlyNumbers
      format="DD-MM-YYYY"
      placeholder={props.placeholder}
      onDateChange={props.onDateChange}
    />
  );
};

export default DatePicker;
