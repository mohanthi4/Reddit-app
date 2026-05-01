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
      console.log("--> after feed", data);
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

export const mockDB = [
  {
    posts: [
      {
        _id: 1,
        userId: 101,
        user: "Alice",
        title: "Post 1",
        description: "Description of post 1",
        likes: 3,
        likedUsers: [102, 103],
        date: "2026-04-01",
      },
      {
        _id: 2,
        userId: 102,
        user: "Bob",
        title: "Post 2",
        description: "Description of post 2",
        likes: 1,
        likedUsers: [101],
        date: "2026-04-02",
      },
      {
        _id: 3,
        userId: 103,
        user: "Charlie",
        title: "Post 3",
        description: "Description of post 3",
        likes: 5,
        likedUsers: [101, 102],
        date: "2026-04-03",
      },
      {
        _id: 4,
        userId: 104,
        user: "David",
        title: "Post 4",
        description: "Description of post 4",
        likes: 0,
        likedUsers: [],
        date: "2026-04-04",
      },
      {
        _id: 5,
        userId: 105,
        user: "Eve",
        title: "Post 5",
        description: "Description of post 5",
        likes: 2,
        likedUsers: [101],
        date: "2026-04-05",
      },
    ],
    nextCursor: 2,
  },

  {
    posts: [
      {
        _id: 6,
        userId: 101,
        user: "Alice",
        title: "Post 6",
        description: "Description of post 6",
        likes: 7,
        likedUsers: [102],
        date: "2026-04-06",
      },
      {
        _id: 7,
        userId: 102,
        user: "Bob",
        title: "Post 7",
        description: "Description of post 7",
        likes: 4,
        likedUsers: [103],
        date: "2026-04-07",
      },
      {
        _id: 8,
        userId: 103,
        user: "Charlie",
        title: "Post 8",
        description: "Description of post 8",
        likes: 9,
        likedUsers: [101, 104],
        date: "2026-04-08",
      },
      {
        _id: 9,
        userId: 104,
        user: "David",
        title: "Post 9",
        description: "Description of post 9",
        likes: 2,
        likedUsers: [],
        date: "2026-04-09",
      },
      {
        _id: 10,
        userId: 105,
        user: "Eve",
        title: "Post 10",
        description: "Description of post 10",
        likes: 6,
        likedUsers: [102],
        date: "2026-04-10",
      },
    ],
    nextCursor: 3,
  },

  {
    posts: [
      {
        _id: 11,
        userId: 101,
        user: "Alice",
        title: "Post 11",
        description: "Description of post 11",
        likes: 3,
        likedUsers: [],
        date: "2026-04-11",
      },
      {
        _id: 12,
        userId: 102,
        user: "Bob",
        title: "Post 12",
        description: "Description of post 12",
        likes: 8,
        likedUsers: [103],
        date: "2026-04-12",
      },
      {
        _id: 13,
        userId: 103,
        user: "Charlie",
        title: "Post 13",
        description: "Description of post 13",
        likes: 1,
        likedUsers: [101],
        date: "2026-04-13",
      },
      {
        _id: 14,
        userId: 104,
        user: "David",
        title: "Post 14",
        description: "Description of post 14",
        likes: 10,
        likedUsers: [105],
        date: "2026-04-14",
      },
      {
        _id: 15,
        userId: 105,
        user: "Eve",
        title: "Post 15",
        description: "Description of post 15",
        likes: 4,
        likedUsers: [101, 102],
        date: "2026-04-15",
      },
    ],
    nextCursor: 4,
  },

  {
    posts: [
      {
        _id: 16,
        userId: 101,
        user: "Alice",
        title: "Post 16",
        description: "Description of post 16",
        likes: 6,
        likedUsers: [],
        date: "2026-04-16",
      },
      {
        _id: 17,
        userId: 102,
        user: "Bob",
        title: "Post 17",
        description: "Description of post 17",
        likes: 2,
        likedUsers: [103],
        date: "2026-04-17",
      },
      {
        _id: 18,
        userId: 103,
        user: "Charlie",
        title: "Post 18",
        description: "Description of post 18",
        likes: 7,
        likedUsers: [104],
        date: "2026-04-18",
      },
      {
        _id: 19,
        userId: 104,
        user: "David",
        title: "Post 19",
        description: "Description of post 19",
        likes: 5,
        likedUsers: [101],
        date: "2026-04-19",
      },
      {
        _id: 20,
        userId: 105,
        user: "Eve",
        title: "Post 20",
        description: "Description of post 20",
        likes: 9,
        likedUsers: [102, 103],
        date: "2026-04-20",
      },
    ],
    nextCursor: 5,
  },

  {
    posts: [
      {
        _id: 21,
        userId: 101,
        user: "Alice",
        title: "Post 21",
        description: "Description of post 21",
        likes: 1,
        likedUsers: [],
        date: "2026-04-21",
      },
      {
        _id: 22,
        userId: 102,
        user: "Bob",
        title: "Post 22",
        description: "Description of post 22",
        likes: 3,
        likedUsers: [101],
        date: "2026-04-22",
      },
      {
        _id: 23,
        userId: 103,
        user: "Charlie",
        title: "Post 23",
        description: "Description of post 23",
        likes: 11,
        likedUsers: [104, 105],
        date: "2026-04-23",
      },
      {
        _id: 24,
        userId: 104,
        user: "David",
        title: "Post 24",
        description: "Description of post 24",
        likes: 8,
        likedUsers: [101],
        date: "2026-04-24",
      },
      {
        _id: 25,
        userId: 105,
        user: "Eve",
        title: "Post 25",
        description: "Description of post 25",
        likes: 6,
        likedUsers: [102, 103],
        date: "2026-04-25",
      },
    ],
    nextCursor: null,
  },
];

export const fetchPosts = async ({ pageParam = 0 }) => {
  const res = mockDB[pageParam];
  const body = JSON.stringify({ cursor: pageParam, limit: 5 });
  const res2 = await fetch("http://localhost:8080/post/feedInfo", {
    body,
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(responeByCheckingError);
  console.log("in fetch back", res2);

  if (!res2) {
    throw new Error("No data found");
  }

  return res2;
};
