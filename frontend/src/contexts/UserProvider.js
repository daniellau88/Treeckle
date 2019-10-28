import React from "react";

export const Context = React.createContext();

class UserProvider extends React.Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const profilePic = localStorage.getItem("profilePic");
    const role = localStorage.getItem("role");

    this.state = {
      token: token,
      name: name,
      profilePic: profilePic ? JSON.parse(profilePic) : profilePic,
      role: role
    };
    this.setUser = this.setUser.bind(this);
    this.resetUser = this.resetUser.bind(this);
  }

  setUser(token, name, profilePic, role) {
    this.setState({
      token: token,
      name: name,
      profilePic: profilePic,
      role: role
    });

    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem(
      "profilePic",
      profilePic ? JSON.stringify(profilePic) : profilePic
    );
    localStorage.setItem("role", role);
  }

  resetUser() {
    this.setState({
      token: null,
      name: null,
      profilePic: null,
      role: null
    });
    localStorage.clear();
  }

  render() {
    return (
      <Context.Provider
        value={{
          token: this.state.token,
          name: this.state.name,
          profilePic: this.state.profilePic,
          role: this.state.role,
          setUser: this.setUser,
          resetUser: this.resetUser
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default UserProvider;
