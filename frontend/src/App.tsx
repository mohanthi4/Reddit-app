import { useReducer, useState, useEffect } from "react";
import { createContext, useContext } from "react";
import "./form.css";
import { LoginReducer } from "./reducers/login-reducer.tsx";

import {Home,Login} from "./main-pages.tsx"


export const UserContext = createContext(null);

const App = () => {
  const [loginInfo, dispatch] = useReducer(LoginReducer, {
    status: false,
    user: "",
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/checkUser", { credentials: "include" })
      .then((data) => data.json())
      .then((data) => {
        dispatch({ type: "init-user", content: data });
      });
  }, []);

  const handleUsersLogin = (content: string) => {
    dispatch({ type: "user-login", content });
  };
  return (
    <>
      {loginInfo.status ? (
        <UserContext value={loginInfo.user}>
          <Home />
        </UserContext>
      ) : (
        <Login handleUsersLogin={handleUsersLogin} />
      )}
    </>
  );
};

export default App;
