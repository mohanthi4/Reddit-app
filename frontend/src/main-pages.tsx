import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";
import { formReducer, type PostData } from "./reducers/form-reducer.tsx";
import { useReducer, useState, useEffect } from "react";
import { SearchLabel } from "./search-label.tsx";
import { subscribersReduce } from "./reducers/search-reducer.tsx";
import * as api from "./api.tsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";

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
    unSubscribe: (content) => dispatch({ type: "unSubscribe", content }),
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
        handleUnSubscribeUser={userActions.unSubscribe}
      />
      <FormCreation addPost={postActions.addPost} current={usersData.current} />
      <Feed data={feedData} usersData={usersData} actions={postActions} />
    </div>
  );
};

export const Login = ({ handleLogin }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button
        variant="contained"
        startIcon={<GitHubIcon />}
        onClick={handleLogin}
      >
        Signin with Github
      </Button>
    </Box>
  );
};
