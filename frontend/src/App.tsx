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
