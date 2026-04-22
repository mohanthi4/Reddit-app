import { useReducer, useEffect } from "react";
import "./form.css";
import { formReducer, type FeedData, type PostData } from "./from-reducer";

type FeedProps = {
  data: FeedData;
  onDelete: (id: number) => void;
};

const PostArticle = ({ id, user, date, title, description, onDelete }) => {
  const handleDeleteFeed = (e, id) => {
    fetch("http://localhost:8080/post/deleteFeed", {
      method: "post",
      body: JSON.stringify(id),
    })
      .then((x) => x.json())
      .catch((e) => console.log(e));
    onDelete(id);
  };

  return (
    <article key={id} className="feed-article">
      <h3>{user}</h3>
      <p className="date">{date}</p>
      <div className="PostData">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button
        className="button-action"
        onClick={(e) => {
          handleDeleteFeed(e, id);
        }}
      >
        Delete
      </button>
    </article>
  );
};

const Feed = ({ data, onDelete }: FeedProps) => {
  return (
    <div className="feed posts">
      <h1>Feed</h1>
      {data.feed.map((f) => (
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

type AddFeed = {
  addPost: (content: PostData) => void;
};

const Form = ({ addPost }: AddFeed) => {
  const handlePost = (e) => {
    e.preventDefault();
    const user = "alex";
    const formData = new FormData(e.target);
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const date = new Date().toString();
    const feed = { user, title, description, date };
    fetch("http://localhost:8080/post/feedInfo", {
      method: "post",
      body: JSON.stringify(feed),
    })
      .then((x) => x.json())
      .catch((e) => console.log(e));
    addPost(feed);
  };

  return (
    <>
      <div className="formData posts">
        <h1>Create Post</h1>
        <form onSubmit={handlePost}>
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

const App = () => {
  const [feedData, dispatch] = useReducer(formReducer, {
    nextId: 1,
    feed: [],
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/feedInfo")
      .then((x) => x.json())
      .then((x) => {
        dispatch({ type: "display-feed", content: x });
      });
  }, []);

  const handleUpdateFeed = (content: PostData) => {
    dispatch({ type: "update-feed", content });
  };

  const handleDeleteFeed = (id: number) => {
    dispatch({ type: "delete-feed", content: id });
  };

  return (
    <>
      <Form addPost={handleUpdateFeed} />
      <Feed data={feedData} onDelete={handleDeleteFeed} />
    </>
  );
};

export default App;
