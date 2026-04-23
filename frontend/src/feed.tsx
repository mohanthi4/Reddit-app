import {
  formReducer,
  type FeedData,
  type PostData,
} from "./reducers/form-reducer.tsx";

const PostArticle = ({ id, user, date, title, description, deletePost }) => {
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
      <h3>{user}</h3>
      <p className="date">{date.toString()}</p>
      <div className="PostData">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button
        className="button-action"
        onClick={(e) => {
          handleDeletePost(e, id);
        }}
      >
        Delete
      </button>
    </article>
  );
};

type FeedProps = {
  data: FeedData;
  deletePost: (id: number) => void;
};

export const Feed = ({ data, deletePost }: FeedProps) => {
  console.log(data,"feed")
  return (
    <div className="feed posts">
      <h1>posts</h1>
      <div className="feedData">
        {data.posts.length > 0 ? (
          data.posts.map((f) => (
            <PostArticle
              key={f._id}
              id={f._id}
              user={f.user}
              date={f.date}
              description={f.description}
              title={f.title}
              deletePost={deletePost}
            />
          ))
        ) : (
          <p>No posts yet</p>
        )}
      </div>
    </div>
  );
};
