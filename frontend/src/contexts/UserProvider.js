import React from "react";

export const Context = React.createContext();

class UserProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { token: "", name: "", profilePic: "" };
    this.setUser = this.setUser.bind(this);
  }

  setUser(token, name, profilePic) {
    this.setState({ token: token, name: name, profilePic: profilePic });
  }

  render() {
    return (
      <Context.Provider
        value={{
          token: this.state.token,
          name: this.state.name,
          profilePic: this.state.profilePic,
          setUser: this.setUser
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default UserProvider;
