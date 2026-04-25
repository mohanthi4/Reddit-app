import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";
import { formReducer, type PostData } from "./reducers/form-reducer.tsx";
import { useReducer, useState, useEffect } from "react";
import { SearchLabel } from "./search-label.tsx";
import { subscribersReduce } from "./reducers/search-reducer.tsx";
import * as api from "./api.tsx";

const usePosts = () => {
  const [feedData, dispatchFeed] = useReducer(formReducer, {
    nextId: 1,
    posts: [],
  });

  const postActions = {
    initPosts: (content) => dispatchFeed({ type: "init-posts", content }),
    addPost: (content) => dispatchFeed({ type: "add-post", content }),
    deletePost: (content) => dispatchFeed({ type: "delete-post", content }),
    likePost: (content) => dispatchFeed({ type: "like-post", content }),
    unLikePost: (content) => dispatchFeed({ type: "unlike-post", content }),
  };

  return { feedData, postActions };
};

const useUsers = () => {
  const [usersData, dispatch] = useReducer(subscribersReduce, {
    all: [],
    current: 0,
  });

  const userActions = {
    initSubcribers: (content) =>
      dispatch({ type: "init-subscribers", content }),
    subscribe: (content) => dispatch({ type: "add-subscriber", content }),
  };

  return { usersData, userActions };
};

export const Home = () => {
  const { feedData, postActions } = usePosts();
  const { usersData, userActions } = useUsers();

  useEffect(() => {
    api.getFeed(postActions.initPosts);
    api.getSubscribers(userActions.initSubcribers);
  }, []);

  return (
    <div className="form">
      <SearchLabel
        usersData={usersData.all}
        handleSubscribeUser={userActions.subscribe}
      />
      <FormCreation addPost={postActions.addPost} current={usersData.current} />
      <Feed
        data={feedData}
        usersData={usersData}
        actions={postActions}
        deletePost={postActions.deletePost}
        handleLikePost={postActions.likePost}
        handleUnlikePost={postActions.unLikePost}
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
