import { useReducer} from "react";
import "./form.css";
import { produce } from "immer";

type FeedProps = {
  data: FeedData;
};

const Feed = ({ data }: FeedProps) => {
  return (
    <div className="feed">
      <h1>Feed</h1>
      {data.feed.map((f) => (
        <article key={f.id}>
          <h3>{f.user}</h3>
          <p className="date">{f.date.toString()}</p>
          <div className="PostData">
            <h2>{f.title}</h2>
            <p>{f.description}</p>
          </div>
        </article>
      ))}

      <button>Delete</button>
    </div>
  );
};

type PostData = {
  id?: number;
  user: string;
  date: string;
  title: string | undefined;
  description: string | undefined;
};

type FormAction = {
  action: (content: PostData) => void;
};

const Form = ({ action }: FormAction) => {
  const handlePost = (e) => {
    e.preventDefault();

    const user = "alex";
    const formData = new FormData(e.target);
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const date = new Date().toString();
    const feed = { user, title, description, date };
    action(feed);
  };

  return (
    <>
      <div className="formData">
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

type ReducerData = { type: "update-feed"; content: PostData };

type FormReducer = (data: FeedData, action: ReducerData) => FeedData;

const formReducer: FormReducer = (feedData, action) => {
  action.content.id = feedData.nextId++;
  console.log(feedData);
  switch (action.type) {
    case "update-feed": {
      return produce(feedData, (draft) => {
        console.log(draft)
        draft.feed.unshift({
          id: draft.nextId++,
          user: action.content.user,
          date:action.content.date,
          title: action.content.title,
          description:action.content.description
        });
      });
    }
  }
};

type FeedData = { nextId: number; feed: PostData[] };

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
  return (
    <>
      <Form action={handleUpdateFeed} />
      <Feed data={feedData} />
    </>
  );
};

export default App;
