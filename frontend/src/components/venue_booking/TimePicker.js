import React from "react";
import "rc-time-picker/assets/index.css";
import ReactTimePicker from "rc-time-picker";
import { Icon } from "semantic-ui-react";
import "../../styles/TimePicker.scss";

const TimePicker = props => {
  const inputIcon = <Icon name="clock" style={{ margin: 0 }} link />;
  return (
    <ReactTimePicker
      className="ui icon input"
      showSecond={false}
      onChange={props.onChange}
      placeholder={props.placeholder}
      format="h:mm a"
      use12Hours
      inputReadOnly
      minuteStep={30}
      inputIcon={props.showInputIcon ? inputIcon : null}
      clearIcon={<Icon name="cancel" style={{ margin: 0 }} link />}
    />
  );
};

export default TimePicker;
