import React from "react";
import CardExampleGroups from "../components/CollapsedEventView";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <main className="profile-page">
        <div className="placeholder">This is the profile page.</div>
      </main>
    );
  }
}

export default ProfilePage;
