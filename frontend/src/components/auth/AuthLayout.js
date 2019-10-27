import React from "react";
import logo from "../../images/treeckle_startup.png";
import { Grid, Image, Segment } from "semantic-ui-react";

const AuthLayout = props => {
  return (
    <Grid style={{ height: "100vh" }} textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: "80%" }}>
        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column verticalAlign="middle">{props.form}</Grid.Column>
            <Grid.Column
              verticalAlign="middle"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Image
                src={logo}
                style={{
                  margin: "2.5em",
                  width: "85%",
                  height: "auto",
                  display: "block"
                }}
              />
            </Grid.Column>
          </Grid>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default AuthLayout;
