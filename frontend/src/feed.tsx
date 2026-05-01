import {
  type FeedData,
  formReducer,
  type PostData,
} from "./reducers/form-reducer.tsx";

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

const PostArticle = ({
  post,
  currentUser,
  deletePost,
  likePost,
  unLikePost,
}) => {
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
        <button className="button-action" onClick={() => deletePost.mutate(id)}>
          Delete
        </button>
      )}
      <LikeButton
        isLiked={isLiked}
        likes={likes}
        onLike={() => likePost.mutate(id)}
        onUnlike={() => unLikePost.mutate(id)}
      />
    </article>
  );
};

export const Feed = ({
  data,
  usersData,
  deletePost,
  likePost,
  unLikePost,
}: FeedProps) => {
  return (
    <div className="feed posts">
      <h1>Feed</h1>
      <div className="feedData">
        {data.pages.length > 0 ? (
          data.pages.map((page, i) => (
            <div key={i}>
              {page.posts.map((post) => (
                <PostArticle
                  key={post._id}
                  post={post}
                  currentUser={usersData.current}
                  deletePost={deletePost}
                  likePost={likePost}
                  unLikePost={unLikePost}
                />
              ))}
            </div>
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};
