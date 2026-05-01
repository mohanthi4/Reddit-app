const responeByCheckingError = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    console.error("Server error:", text);
    return null;
  }
  return res.json();
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
  return fetch("http://localhost:8080/post/addPost", {
    method: "post",
    body: JSON.stringify(body),
    credentials: "include",
  }).then(responeByCheckingError);
};

export const deletion = (id) => {
  return fetch("http://localhost:8080/post/deletePost", {
    method: "post",
    body: JSON.stringify(id),
  }).then(responeByCheckingError);
};

export const likePost = (id) => {
  return fetch("http://localhost:8080/post/addLike", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  }).then(responeByCheckingError);
};

export const unLikePost = (id) => {
  return fetch("http://localhost:8080/post/unLike", {
    method: "post",
    body: JSON.stringify(id),
    credentials: "include",
  }).then(responeByCheckingError);
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

export const fetchPosts = async ({ pageParam = 0 }) => {
  const body = JSON.stringify({ cursor: pageParam, limit: 5 });
  const response = await fetch("http://localhost:8080/post/feedInfo", {
    body,
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(responeByCheckingError);

  if (!response) {
    throw new Error("No data found");
  }

  return response;
};
