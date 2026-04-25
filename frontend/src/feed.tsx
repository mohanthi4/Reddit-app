import {
  formReducer,
  type FeedData,
  type PostData,
} from "./reducers/form-reducer.tsx";
import * as api from "./api.tsx";

type FeedProps = {
  data: FeedData;
  deletePost: (id: number) => void;
};

const UserHeader = ({ user, currentUser, userId }) => (
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
);

const LikeButton = ({ isLiked, likes, onLike, onUnlike }) => (
  <button
    className={`likes ${isLiked ? "like-true" : "unlike"}`}
    onClick={isLiked ? onUnlike : onLike}
  >
    Liked {likes}
  </button>
);

const PostArticle = ({ post, currentUser, actions }) => {
  const {
    _id: id,
    userId,
    user,
    date,
    title,
    description,
    likes,
    likedUsers,
  } = post;
  const handleDeletePost = (e) => {
    e.preventDefault();
    actions.deletePost(id);
    api.deletion(id);
  };

  const handleLike = (e) => {
    const content = { id, currentUser };
    actions.likePost(content);
    api.likePost(id);
  };

  const handleUnlike = (e) => {
    const content = { id, currentUser };
    actions.unLikePost(content);
    api.unLikePost(id);
  };

  const isLiked = likedUsers.includes(currentUser);
  return (
    <article className="posts-article">
      <UserHeader user={user} currentUser={currentUser} userId={userId} />
      <p className="date">{date.toString()}</p>
      <div className="PostData">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {currentUser === userId && (
        <button
          className="button-action"
          onClick={(e) => {
            handleDeletePost(e);
          }}
        >
          Delete
        </button>
      )}
      <LikeButton
        isLiked={isLiked}
        likes={likes}
        onLike={handleLike}
        onUnlike={handleUnlike}
      />
    </article>
  );
};

export const Feed = ({ data, usersData, actions }: FeedProps) => {
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
              post={f}
              currentUser={channelsFeed.myId}
              actions={actions}
            />
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};
