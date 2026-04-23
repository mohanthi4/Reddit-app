import { useReducer, useState, useEffect } from "react";
import { createContext, useContext } from "react";
import "./form.css";
import { formReducer, type PostData } from "./reducers/form-reducer.tsx";
import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";
import { produce } from "immer";

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

const Login = ({ setLogin }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = formData.get("user")?.toString();
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

const LoginReducer = (loginInfo, action) => {
  switch (action.type) {
    case "init-user": {
      return produce(loginInfo, (draft) => action.content);
    }
  }
};

export const UserContext = createContext(null);

const App = () => {
  // const [loginInfo, setLogin] = useState({ status: false, user: "" });

  const [loginInfo, dispatch] = useReducer(LoginReducer, {
    status: false,
    user: "",
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/checkUser")
      .then((data) => data.json())
      .then((data) => {
        dispatch({ type: "init-user", content: data });
      });
  }, []);
  return (
    <>
      {loginInfo.status ? (
        <UserContext value={loginInfo.user}>
          <Home />
        </UserContext>
      ) : (
        <Login setLogin={dispatch} />
      )}
    </>
  );
};

export default App;
