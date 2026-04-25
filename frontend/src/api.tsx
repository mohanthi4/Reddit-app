export const getFeed = (dispatchFeed) => {
  fetch("http://localhost:8080/get/feedInfo", { credentials: "include" })
    .then((data) => data.json())
    .then((data) => {
      dispatchFeed({ type: "init-posts", content: data });
    });
};

export const getSubscribers = (dispatch) => {
  fetch("http://localhost:8080/get/subscribers", { credentials: "include" })
    .then((data) => data.json())
    .then((data) => {
      dispatch({ type: "init-subscribers", content: data });
    });
};

export const usersLogin = (handleUsersLogin, body) => {
  fetch("http://localhost:8080/post/loginUser", {
    method: "post",
    body: JSON.stringify(body),
    credentials: "include",
  })
    .then(async (x) => {
      if (!x.ok) {
        const text = await x.text();
        console.error("Server error:", text);
        return null;
      }
      return x.json();
    })
    .then((user) => {
      if (!user) return;
      handleUsersLogin(user);
    })
    .catch((e) => console.log(e));
};

export const checkUserLogin = (dispatch) => {
  fetch("http://localhost:8080/get/checkUser", { credentials: "include" })
    .then((data) => data.json())
    .then((data) => {
      dispatch({ type: "init-user", content: data });
    });
};

export const addingPost = (addPost, body) => {
  fetch("http://localhost:8080/post/addPost", {
    method: "post",
    body: JSON.stringify(body),
    credentials: "include",
  })
    .then((x) => x.json())
    .catch((e) => console.log(e));
};

export const deletion = (deletePost, id) => {
  fetch("http://localhost:8080/post/deletePost", {
    method: "post",
    body: JSON.stringify(id),
  })
    .then((x) => x.json())
    .catch((e) => console.error(e));
};

export const likePost = (handleLikePost, id) => {
  fetch("http://localhost:8080/post/addLike", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  })
    .then((x) => x.json())
    .catch((e) => console.error(e));
};

export const unLikePost = (handleUnlikePost, id) => {
  fetch("http://localhost:8080/post/unLike", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  })
    .then((x) => x.json())
    .catch((e) => console.error(e));
};

export const addSubscriber = (id) => {
  fetch("http://localhost:8080/post/addSubscriber", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  })
    .then((x) => x.json())
    .catch((e) => console.error(e));
};
