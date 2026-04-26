const responeByCheckingError = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    console.error("Server error:", text);
    return null;
  }
  return res.json();
};

export const getFeed = (dispatchFeed) => {
  fetch("http://localhost:8080/get/feedInfo", { credentials: "include" })
    .then(responeByCheckingError)
    .then((data) => {
      if (!data) return;
      dispatchFeed(data);
    });
};

export const getSubscribers = (dispatch) => {
  fetch("http://localhost:8080/get/subscribers", { credentials: "include" })
    .then(responeByCheckingError)
    .then((data) => {
      if (!data) return;
      dispatch(data);
    });
};

export const usersLogin = (handleUsersLogin, body) => {
  fetch("http://localhost:8080/post/loginUser", {
    method: "post",
    body: JSON.stringify(body),
    credentials: "include",
  })
    .then(responeByCheckingError)
    .then((res) => {
      if (!res) return;
      handleUsersLogin(res);
    })
    .catch((e) => console.log(e));
};

export const checkUserLogin = (dispatch) => {
  fetch("http://localhost:8080/get/checkUser", { credentials: "include" })
    .then(responeByCheckingError)
    .then((data) => {
      if (!data) return;
      dispatch({ type: "init-login", content: data });
    });
};

export const addingPost = (body) => {
  fetch("http://localhost:8080/post/addPost", {
    method: "post",
    body: JSON.stringify(body),
    credentials: "include",
  })
    .then(responeByCheckingError)
    .catch((e) => console.log(e));
};

export const deletion = (id) => {
  fetch("http://localhost:8080/post/deletePost", {
    method: "post",
    body: JSON.stringify(id),
  })
    .then(responeByCheckingError)
    .catch((e) => console.error(e));
};

export const likePost = (id) => {
  fetch("http://localhost:8080/post/addLike", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  })
    .then(responeByCheckingError)
    .catch((e) => console.error(e));
};

export const unLikePost = (id) => {
  fetch("http://localhost:8080/post/unLike", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  })
    .then(responeByCheckingError)
    .catch((e) => console.error(e));
};

export const addSubscriber = (id) => {
  fetch("http://localhost:8080/post/addSubscriber", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  })
    .then(responeByCheckingError)
    .catch((e) => console.error(e));
};

export const UnSubscriber = (id) => {
  fetch("http://localhost:8080/post/unSubscriber", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  })
    .then(responeByCheckingError)
    .catch((e) => console.error(e));
};
