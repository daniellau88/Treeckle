import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const Context = React.createContext();

const UserProvider = props => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profilePic")
  );
  const [role, setRole] = useState(localStorage.getItem("role"));
  const history = useHistory();

  const setUser = (token, name, profilePic, role) => {
    setToken(token);
    setName(name);
    setProfilePic(profilePic);
    setRole(role);

    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("profilePic", profilePic);
    localStorage.setItem("role", role);
  };

  const resetUser = () => {
    localStorage.clear();
    setUser(null, null, null, null);
    history.push("/");
  };

  return (
    <Context.Provider
      value={{
        token: token,
        name: name,
        profilePic: profilePic,
        role: role,
        setUser: setUser,
        resetUser: resetUser
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default UserProvider;
