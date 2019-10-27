import React from "react";

export const Context = React.createContext();

class UserProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage.getItem("token"),
      name: localStorage.getItem("name"),
      profilePic: localStorage.getItem("profilePic"),
      role: localStorage.getItem("role")
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
    localStorage.setItem("profilePic", profilePic);
    localStorage.setItem("role", role);
  }

  resetUser() {
    localStorage.clear();
    this.setUser(null, null, null, null);
    window.location.replace("/");
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
