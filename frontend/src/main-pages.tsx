import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";
import { formReducer, type PostData } from "./reducers/form-reducer.tsx";
import { useReducer, useState, useEffect } from "react";
import { SearchLabel } from "./search-label.tsx";
import { subscribersReduce } from "./reducers/search-reducer.tsx";
import * as api from "./api.tsx";

export const Home = () => {
  const [feedData, dispatchFeed] = useReducer(formReducer, {
    nextId: 1,
    posts: [],
  });

  const [usersData, dispatch] = useReducer(subscribersReduce, {
    all: [],
    current: 0,
  });

  useEffect(() => {
    api.getFeed(dispatchFeed);
    api.getSubscribers(dispatch);
  }, []);

  const postDispatch = (type) => (content) => {
    console.log("in dispatch", content);
    dispatchFeed({ type, content });
  };
  const userDispatch = (type) => (content) => dispatch({ type, content });

  const handleSubscribeUser = userDispatch("add-subscriber");
  const handleAddPost = postDispatch("add-post");
  const handleDeletePost = postDispatch("delete-post");
  const handleLikePost = postDispatch("like-post");
  const handleUnlikePost = postDispatch("unlike-post");

  return (
    <div className="form">
      <SearchLabel
        usersData={usersData.all}
        handleSubscribeUser={handleSubscribeUser}
      />
      <FormCreation addPost={handleAddPost} current={usersData.current} />
      <Feed
        data={feedData}
        usersData={usersData}
        deletePost={handleDeletePost}
        handleLikePost={handleLikePost}
        handleUnlikePost={handleUnlikePost}
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
    api.usersLogin(handleUsersLogin, body);
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
