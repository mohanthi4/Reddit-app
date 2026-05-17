import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";
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
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import "./icons.css";

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

const getFabStyle = (active) => ({
  bgcolor: active ? "primary.main" : "white",
  color: active ? "white" : "primary.main",
  "&:hover": {
    bgcolor: active ? "primary.dark" : "white",
    color: active ? "white" : "primary.main",
  },
});

const MainIcons = ({ open, setOpen }) => {
  return (
    <Box className="fab-container">
      <Fab onClick={() => setOpen(false)} sx={getFabStyle(!open)}>
        <HomeIcon />
      </Fab>

      <Fab onClick={() => setOpen(true)} sx={getFabStyle(open)}>
        <AddIcon />
      </Fab>
    </Box>
  );
};

export const Home = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { usersData, userActions } = useUsers();
  const { addMutation, deleteMutation, likeMutation, unlikeMutation } =
    postMutations();
  const [open, setOpen] = useState(false);

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
        userActions={{
          handleSubscribeUser: userActions.subscribe,
          handleUnSubscribeUser: userActions.unSubscribe,
        }}
      />

      <Box sx={{ display: "flex", width: "100%" }}>
        <Box sx={{ width: 80, flexShrink: 0 }}>
          <MainIcons open={open} setOpen={setOpen} />
        </Box>
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {open ? (
            <FormCreation current={usersData.current} addPost={addMutation} />
          ) : (
            <>
              <Feed
                data={data}
                usersData={usersData}
                postActions={{ deleteMutation, likeMutation, unlikeMutation }}
              />
              <div ref={bottomRef} style={{ height: 50 }}>
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                    ? "Scroll to load more"
                    : "No more posts"}
              </div>
            </>
          )}
        </Box>
      </Box>
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
