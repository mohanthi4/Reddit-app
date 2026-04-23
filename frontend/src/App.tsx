import { useReducer, useState, useEffect } from "react";
import { createContext, useContext } from "react";
import "./form.css";
import { formReducer, type PostData } from "./reducers/form-reducer.tsx";
import { LoginReducer } from "./reducers/login-reducer.tsx";
import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";

const Home = () => {
  const [feedData, dispatch] = useReducer(formReducer, {
    nextId: 1,
    posts: [],
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/feedInfo")
      .then((data) => data.json())
      .then((data) => {
        dispatch({ type: "init-posts", content: data });
      });
  }, []);

  const handleAddPost = (content: PostData) => {
    dispatch({ type: "add-post", content });
  };

  const handleDeletePost = (id: number) => {
    dispatch({ type: "delete-post", content: id });
  };

  return (
    <div className="form">
      <FormCreation addPost={handleAddPost} />
      <Feed data={feedData} deletePost={handleDeletePost} />
    </div>
  );
};

const Login = ({ handleUsersLogin }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = formData.get("user")?.toString();
    const password = formData.get("password")?.toString();
    const body = { user, password };
    fetch("http://localhost:8080/post/loginUser", {
      method: "post",
      body: JSON.stringify(body),
      credentials: "include",
    })
      .then((x) => x.json())
      .then((user) => {
        console.log(user)
        handleUsersLogin(user)
      })
      .catch((e) => console.log(e));

    // setLogin({ status: true, user: { user } });
  };

  return (
    <div className="form">
      <h1>Login Page</h1>
      <form onSubmit={handleLogin} className="formData">
        <label>Username</label>
        <input name="user" type="text" />
        <label>Password</label>
        <input type="password" name="" id="" name="password" />
        <button className="loginButton">Login</button>
      </form>
    </div>
  );
};

type LoginInfo = {
  status: boolean;
  user: string;
};

export const UserContext = createContext(null);

const App = () => {
  const [loginInfo, dispatch] = useReducer(LoginReducer, {
    status: false,
    user: "",
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/checkUser",{credentials:"include"})
      .then((data) => data.json())
      .then((data) => {
        console.log(data,"in check")
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
