import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";
import { formReducer, type PostData } from "./reducers/form-reducer.tsx";
import { useEffect, useReducer, useRef, useState } from "react";
import { SearchLabel } from "./search-label.tsx";
import { subscribersReduce } from "./reducers/search-reducer.tsx";
import * as api from "./api.tsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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

const usePostMutation = (mutationFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};

const postMutations = () => {
  const addMutation = usePostMutation(api.addingPost);
  const likeMutation = usePostMutation(api.likePost);
  const unlikeMutation = usePostMutation(api.unLikePost);
  const deleteMutation = usePostMutation(api.deletion);

  return { addMutation, deleteMutation, likeMutation, unlikeMutation };
};

export const Home = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { usersData, userActions } = useUsers();
  const { addMutation, deleteMutation, likeMutation, unlikeMutation } =
    postMutations();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: api.fetchPosts,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  useEffect(() => {
    api.getSubscribers(userActions.initSubcribers);

    if (!bottomRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (status === "pending") return <p>Loading...</p>;

  return (
    <div className="form">
      <SearchLabel
        usersData={usersData.all}
        handleSubscribeUser={userActions.subscribe}
        handleUnSubscribeUser={userActions.unSubscribe}
      />
      <FormCreation current={usersData.current} addPost={addMutation} />
      <Feed
        data={data}
        usersData={usersData}
        deletePost={deleteMutation}
        likePost={likeMutation}
        unLikePost={unlikeMutation}
      />
      <div ref={bottomRef} ></div>
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
