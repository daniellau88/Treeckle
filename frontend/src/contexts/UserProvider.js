import React from "react";

export const Context = React.createContext();

class UserProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: "", displayName: "" };
    this.setUser = this.setUser.bind(this);
  }

  setUser(user, displayName) {
    this.setState({ user: user, displayName: displayName });
  }

  render() {
    return (
      <Context.Provider
        value={{
          user: this.state.user,
          displayName: this.state.displayName,
          setUser: this.setUser
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default UserProvider;
