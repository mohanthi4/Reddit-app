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
    ⬆ {likes}
  </button>
);

const PostArticle = ({ post, currentUser, postActions }) => {
  const {
    _id: id,
    userId,
    user,
    date,
    title,
    description,
    image,
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
        {image && (
          image.includes("/video/upload/") ? (
            <video src={image} style={{ height: "200px" }} controls />
          ) : (
            <img src={image} style={{ height: "200px" }} alt="description" />
          )
        )}
      </div>

      <LikeButton
        isLiked={isLiked}
        likes={likes}
        onLike={() => postActions.likeMutation.mutate(id)}
        onUnlike={() => postActions.unlikeMutation.mutate(id)}
      />
      {currentUser === userId && (
        <button
          className="delete"
          onClick={() => postActions.deleteMutation.mutate(id)}
        >
          Delete
        </button>
      )}
    </article>
  );
};

export const Feed = ({ data, usersData, postActions }) => {
  return (
    <div className="posts">
      <h1>Feed</h1>

      <div className="feedData">
        {data.pages.length > 0 ? (
          data.pages.map((page, i) => (
            <div key={page.nextCursor}>
              {page.posts.map((post) => (
                <PostArticle
                  key={post._id}
                  post={post}
                  currentUser={usersData.current}
                  postActions={postActions}
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
