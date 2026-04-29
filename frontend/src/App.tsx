import { useEffect, useReducer, useState } from "react";
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

  const handleLogin = (e) => {
    globalThis.location.href = "http://localhost:8080/get/handleAuthLogin";
  };

  return (
    <>
      {loginInfo.status
        ? (
          <UserContext value={loginInfo.user}>
            <Home />
          </UserContext>
        )
        : <Login handleLogin={handleLogin} />}
    </>
  );
};

export default App;
