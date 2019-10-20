import React from "react";
import placeholderDP from "../images/avatar.png";
import { Context } from "../contexts/UserProvider";
import { axios } from "axios";
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
    data.append("file", this.state.file);
    const config = {
      headers: {
        Authorization: `Bearer ${this.context.token}`,
        "Content-Type": "multipart/form-data"
      }
    };
    //axios.post(, data, config).then(response => {}); //todo
  };

  render() {
    return (
      <Grid stackable>
        <Grid.Row>
          <Grid.Column computer={4} tablet={8}>
            <Responsive as={Segment} basic minWidth={750}>
              <Popup
                trigger={
                  <Image
                    src={placeholderDP}
                    size="medium"
                    circular
                    bordered
                    style={{ cursor: "pointer" }}
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
                  <p style={{ fontSize: "0.75em", color: "#656565" }}>
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
                    />
                    <Button
                      content="View My Events"
                      icon="calendar"
                      labelPosition="left"
                    />
                  </Button.Group>
                </Segment>
              </Grid.Column>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ProfileCard;
