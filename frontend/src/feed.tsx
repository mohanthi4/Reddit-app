import {
  formReducer,
  type FeedData,
  type PostData,
} from "./reducers/form-reducer.tsx";
import * as api from "./api.tsx";

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
  handleLikePost,
  handleUnlikePost,
}) => {
  const handleDeletePost = (e, id) => {
    e.preventDefault();
    deletePost(id);
    api.deletion(deletePost, id);
  };

  const handleLike = (e, id) => {
    const content = { id, currentUser };
    handleLikePost(content);
    api.likePost(handleLikePost, id);
  };

  const handleUnlike = (e, id) => {
    const content = { id, currentUser };
    handleUnlikePost(content);
    api.unLikePost(handleUnlikePost, id);
  };

  const isLiked = likedUsers.includes(currentUser);
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
      <button
        className={`likes ${isLiked ? "like-true" : "unlike"}`}
        onClick={(e) => {
          if (!isLiked) handleLike(e, id);
          else handleUnlike(e, id);
        }}
      >
        Liked {likes}
      </button>
    </article>
  );
};

type FeedProps = {
  data: FeedData;
  deletePost: (id: number) => void;
};

export const Feed = ({
  data,
  deletePost,
  usersData,
  handleLikePost,
  handleUnlikePost,
}: FeedProps) => {
  const feed = usersData.all.filter((x) => x.isSubscribe);
  const data1 = feed.map((x) => x.id);
  const channelsFeed = { myId: usersData.current, subscribers: data1 };
  const posts = data.posts.filter((x) => {
    return (
      x.userId === channelsFeed.myId ||
      channelsFeed.subscribers.includes(x.userId)
    );
  });

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
              handleLikePost={handleLikePost}
              currentUser={channelsFeed.myId}
              handleUnlikePost={handleUnlikePost}
            />
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};
