import { useReducer } from "react";
import "./form.css";
import { formReducer, type FeedData, type PostData } from "./from-reducer";

type FeedProps = {
  data: FeedData;
  onDelete: (id: number ) => void;
};

const Feed = ({ data, onDelete }: FeedProps) => {
  return (
    <div className="feed posts">
      <h1>Feed</h1>
      {data.feed.map((f) => (
        <article key={f.id} className="feed-article">
          <h3>{f.user}</h3>
          <p className="date">{f.date.toString()}</p>
          <div className="PostData">
            <h2>{f.title}</h2>
            <p>{f.description}</p>
          </div>
          <button className="button-action" onClick={() => onDelete(f.id)}>
            Delete
          </button>
        </article>
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
  const initialInfo: PostData = {
    id: 1,
    user: "alex",
    date: new Date().toString(),
    title: "First post",
    description: "welcome to new post",
  };

  const [feedData, dispatch] = useReducer(formReducer, {
    nextId: 2,
    feed: [initialInfo],
  });

  const handleUpdateFeed = (content: PostData) => {
    dispatch({ type: "update-feed", content });
  };

  const handleDeleteFeed = (id: number) => {
    console.log(id,feedData)
    dispatch({ type: "delete-feed", content:id-1 });
  };

  return (
    <>
      <Form addPost={handleUpdateFeed} />
      <Feed data={feedData} onDelete={handleDeleteFeed} />
    </>
  );
};

export default App;
