import { useReducer, useState, useEffect } from "react";
import { createContext, useContext } from "react";
import "./form.css";
import { LoginReducer } from "./reducers/login-reducer.tsx";
import { Home, Login } from "./main-pages.tsx";
import * as api from "./api.tsx";

export const UserContext = createContext(null);

const App = () => {
  const [loginInfo, dispatch] = useReducer(LoginReducer, {
    status: false,
    user: "",
  });

  useEffect(() => {
    api.checkUserLogin(dispatch);
  }, []);

  const handleUsersLogin = (content) => {
    dispatch({ type: "init-login", content });
  };

  const handleLogin = (e) => {
    window.location.href = "http://localhost:8080/get/handleAuthLogin";
  };

  return (
    <>
      {
        loginInfo.status ? (
          <UserContext value={loginInfo.user}>
            <Home />
          </UserContext>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )
        //   (
        //   <Login handleUsersLogin={handleUsersLogin} />
        // )
      }
    </>
  );
};

export default App;
