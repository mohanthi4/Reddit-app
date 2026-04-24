import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";
import { formReducer, type PostData } from "./reducers/form-reducer.tsx";
import { useReducer, useState, useEffect } from "react";
import { SearchLabel } from "./search-label.tsx";
import { subscribersReduce } from "./reducers/search-reducer.tsx";

export const Home = () => {
  const [feedData, dispatchFeed] = useReducer(formReducer, {
    nextId: 1,
    posts: [],
  });
  console.log("in feed");

  useEffect(() => {
    fetch("http://localhost:8080/get/feedInfo", { credentials: "include" })
      .then((data) => data.json())
      .then((data) => {
        console.log("in fetch", data);
        dispatchFeed({ type: "init-posts", content: data });
      });
  }, []);

  // const feedData = {
  //   nextId: 5,
  //   posts: [
  //     {
  //       _id: 1,
  //       userId: 1,
  //       user: "John",
  //       title: "hi",
  //       description: "welcome to new",
  //       date: "20/12/2024",
  //     },
  //     {
  //       _id: 2,
  //       userId: 2,
  //       user: "Alex",
  //       title: "Well",
  //       description: "welcome to old",
  //       date: "20/11/2024",
  //     },
  //     {
  //       _id: 3,
  //       userId: 3,
  //       user: "Ram",
  //       title: "super",
  //       description: "wow",
  //       date: "20/10/2024",
  //     },
  //     {
  //       _id: 4,
  //       userId: 1,
  //       user: "John",
  //       title: "yay",
  //       description: "it works...",
  //       date: "20/09/2024",
  //     },
  //   ],
  // };
  const [usersData, dispatch] = useReducer(subscribersReduce, {
    all: [],
    current: 0,
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/subscribers", { credentials: "include" })
      .then((data) => data.json())
      .then((data) => {
        dispatch({ type: "init-subscribers", content: data });
      });
  }, []);

  const handleAddPost = (content: PostData) => {
    dispatchFeed({ type: "add-post", content });
  };

  const handleDeletePost = (id: number) => {
    dispatchFeed({ type: "delete-post", content: id });
  };

  return (
    <div className="form">
      <SearchLabel usersData={usersData.all} />
      <FormCreation addPost={handleAddPost} />
      <Feed
        data={feedData}
        deletePost={handleDeletePost}
        usersData={usersData}
      />
    </div>
  );
};

export const Login = ({ handleUsersLogin }) => {
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
        handleUsersLogin(user);
      })
      .catch((e) => console.log(e));
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
