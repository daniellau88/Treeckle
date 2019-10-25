import React from "react";
import { Link } from "react-router-dom";
import { Context } from "../contexts/UserProvider";
import axios from "axios";
import {
  Grid,
  Header,
  Image,
  Button,
  Segment,
  Responsive,
  Icon,
  Popup
} from "semantic-ui-react";
import { DEVELOPMENT_VIEW } from "../DevelopmentView";

function getBase64IntArray(arr) {
  let TYPED_ARRAY = new Uint8Array(arr);
  const STRING_CHAR = String.fromCharCode.apply(null, TYPED_ARRAY);
  return btoa(STRING_CHAR);
}

function getIntArrayBase64(str) {
  let STRING_CHAR = Array.from(atob(str));
  let TYPED_ARRAY = STRING_CHAR.map(x => x.charCodeAt(0));
  return TYPED_ARRAY;
}

class ProfileCard extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
  }

  fileInputRef = React.createRef();

  fileChange = e => {
    this.setState({ file: e.target.files[0] }, () => {
      console.log("File chosen --->", this.state.file);
    });
    const data = new FormData();
    data.append("profilePicture", this.state.file);
    let reader = new FileReader();
    let newProfilePic;
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      console.log(reader.result);
      newProfilePic = getIntArrayBase64(reader.result.substring(22));
    };
    const config = {
      headers: {
        Authorization: `Bearer ${this.context.token}`,
        "Content-Type": "multipart/form-data"
      }
    };
    axios
      .put("/api/accounts/profilePicture", data, config)
      .then(res => {
        if (res.status === 200) {
          console.log("Success!");
          this.context.setUser(
            this.context.token,
            this.context.name,
            newProfilePic,
            this.context.role
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <Segment placeholder background={"#fcfcfc"}>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column computer={4} tablet={8}>
              <Responsive as={Segment} basic minWidth={750}>
                <Popup
                  trigger={
                    <Image
                      src={`data:image/jpeg;base64,${getBase64IntArray(
                        this.context.profilePic
                      )}`}
                      size="medium"
                      circular
                      bordered
                      style={{ cursor: "pointer", background: "#ffffff" }}
                    />
                  }
                  content={
                    <div>
                      <Button
                        animated="fade"
                        onClick={() => this.fileInputRef.current.click()}
                      >
                        <Button.Content hidden>
                          <Icon name="camera" />
                        </Button.Content>
                        <Button.Content visible>
                          Upload Profile Picture
                        </Button.Content>
                      </Button>
                      <input
                        ref={this.fileInputRef}
                        type="file"
                        hidden
                        onChange={this.fileChange}
                      />
                    </div>
                  }
                  on={"click"}
                  position="bottom center"
                />
              </Responsive>
            </Grid.Column>

            <Grid.Column computer={12} tablet={8} stretched>
              <Grid columns={1}>
                <Grid.Column stretched>
                  <Segment basic compact size="huge">
                    <Header size={"huge"}>{this.context.name}</Header>
                    <p style={{ fontSize: "0.75em" }}>
                      <br />
                      <strong>Role: </strong>
                      {this.context.role}
                    </p>
                  </Segment>
                  <Segment basic compact></Segment>
                  <Segment basic compact>
                    <Button.Group vertical>
                      <Button
                        content="View My Bookings"
                        icon="book"
                        labelPosition="left"
                        as={Link}
                        to={"/bookings"}
                      />
                      {DEVELOPMENT_VIEW && (
                        <Button
                          content="View My Events"
                          icon="calendar"
                          labelPosition="left"
                          as={Link}
                          to={"/events"}
                        />
                      )}
                    </Button.Group>
                  </Segment>
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

export default ProfileCard;
