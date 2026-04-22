import { formReducer, type FeedData, type PostData } from "./form-reducer.tsx";

type FeedProps = {
  data: FeedData;
  onDelete: (id: number) => void;
};

const PostArticle = ({ id, user, date, title, description, onDelete }) => {
  const handleDeletePosts = (e, id) => {
    fetch("http://localhost:8080/post/deletePost", {
      method: "post",
      body: JSON.stringify(id)
    })
      .then((x) => x.json())
      .catch((e) => console.log(e));
    onDelete(id);
  };

  return (
    <article key={id} className="posts-article">
      <h3>{user}</h3>
      <p className="date">{date}</p>
      <div className="PostData">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button
        className="button-action"
        onClick={(e) => {
          handleDeletePosts(e, id);
        }}
      >
        Delete
      </button>
    </article>
  );
};

export const Feed = ({ data, onDelete }: FeedProps) => {
  return (
    <div className="feed posts">
      <h1>posts</h1>
      {data.posts.map((f) => (
        <PostArticle
          key={f.id}
          id={f.id}
          user={f.user}
          date={f.date.toString()}
          description={f.description}
          title={f.title}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

type AddPosts = {
  addPost: (content: PostData) => void;
};


export const Form = ({ addPost }: AddPosts) => {
  const handleAddPost = (e) => {
    e.preventDefault();
    const user = "alex";
    const formData = new FormData(e.target);
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const date = new Date().toString();
    const posts = { user, title, description, date };
    fetch("http://localhost:8080/post/addPost", {
      method: "post",
      body: JSON.stringify(posts),
    })
      .then((x) => x.json())
      .catch((e) => console.log(e));
    addPost(posts);
  };

  return (
    <>
      <div className="formData posts">
        <h1>Create Post</h1>
        <form onSubmit={handleAddPost}>
          <label>Title</label>
          <input name="title" type="text" placeholder="Enter a title..." />
          <label>Body</label>
          <textarea
            name="description"
            placeholder="Write your post..."
          ></textarea>
          <button>Post</button>
        </form>
      </div>
    </>
  );
};
