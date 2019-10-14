import React from "react";
import { Container, Menu } from "semantic-ui-react";
import ProfileCard from "../components/ProfileCard";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.user1 = {
      displayName: "John Doe",
      role: "Event Organizer",
      email: "e0123456@u.nus.edu"
    };
  }

  render() {
    return (
      <main className="profile-page">
        <Menu size="huge"></Menu>
        <br />
        <div style={{ margin: "2em 2em" }}>
          <ProfileCard user={this.user1} />
        </div>
      </main>
    );
  }
}

export default ProfilePage;
