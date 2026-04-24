import {
  formReducer,
  type FeedData,
  type PostData,
} from "./reducers/form-reducer.tsx";

const PostArticle = ({
  id,
  userId,
  user,
  date,
  title,
  description,
  likes,
  likedUsers,
  deletePost,
  currentUser,
}) => {
  const handleDeletePost = (e, id) => {
    e.preventDefault();
    fetch("http://localhost:8080/post/deletePost", {
      method: "post",
      body: JSON.stringify(id),
    })
      .then((x) => x.json())
      .catch((e) => console.error(e));
    deletePost(id);
  };
  return (
    <article className="posts-article">
      <h2>
        {currentUser === userId ? (
          <>
            {user}
            <span className="my-user">You</span>
          </>
        ) : (
          user
        )}
      </h2>
      <p className="date">{date.toString()}</p>
      <div className="PostData">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {currentUser === userId ? (
        <button
          className="button-action"
          onClick={(e) => {
            handleDeletePost(e, id);
          }}
        >
          Delete
        </button>
      ) : (
        <></>
      )}
      {likedUsers.includes(currentUser) ? (
        <button className="like-true likes">Liked {likes}</button>
      ) : (
        <button className="likes">Liked {likes}</button>
      )}
    </article>
  );
};

type FeedProps = {
  data: FeedData;
  deletePost: (id: number) => void;
};

export const Feed = ({ data, deletePost, usersData }: FeedProps) => {
  const feed = usersData.all.filter((x) => x.isSubscribe);
  const data1 = feed.map((x) => x.id);
  const channelsFeed = { myId: usersData.current, subscribers: data1 };
  const posts = data.posts.filter((x) => {
    return (
      x.userId === channelsFeed.myId ||
      channelsFeed.subscribers.includes(x.userId)
    );
  });
  console.log("post all", posts);

  // const posts = [
  //   {
  //     _id: 1,
  //     userId: 1,
  //     user: "John",
  //     date: "23/12/2024",
  //     description: "1 desc",
  //     title: "1",
  //     likes: 2,
  //     likedUsers: [1, 3],
  //   },
  //   {
  //     _id: 2,
  //     userId: 1,
  //     user: "John",
  //     date: "23/11/2024",
  //     description: "2 desc",
  //     title: "2",
  //     likes: 3,
  //     likedUsers: [4, 2, 3],
  //   },
  //   {
  //     _id: 3,
  //     userId: 2,
  //     user: "Alex",
  //     date: "23/10/2024",
  //     description: "3 desc",
  //     title: "3",
  //     likes: 2,
  //     likedUsers: [1, 3],
  //   },
  // ];
  return (
    <div className="feed posts">
      <h1>Feed</h1>
      <div className="feedData">
        {posts.length > 0 ? (
          posts.map((f) => (
            <PostArticle
              key={f._id}
              id={f._id}
              userId={f.userId}
              user={f.user}
              date={f.date}
              description={f.description}
              title={f.title}
              likes={f.likes}
              likedUsers={f.likedUsers}
              deletePost={deletePost}
              currentUser={channelsFeed.myId}
            />
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};
