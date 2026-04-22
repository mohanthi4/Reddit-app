import { useReducer, useEffect } from "react";
import "./form.css";
import { formReducer, type PostData } from "./form-reducer.tsx";
import { Feed, Form } from "./feed-form.tsx";

const App = () => {
  const [feedData, dispatch] = useReducer(formReducer, {
    nextId: 1,
    posts: [],
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/feedInfo")
      .then((x) => x.json())
      .then((x) => {
        dispatch({ type: "display-posts", content: x });
      });
  }, []);

  const handleUpdateFeed = (content: PostData) => {
    dispatch({ type: "update-posts", content });
  };

  const handleDeleteFeed = (id: number) => {
    dispatch({ type: "delete-posts", content: id });
  };

  return (
    <>
      <Form addPost={handleUpdateFeed} />
      <Feed data={feedData} onDelete={handleDeleteFeed} />
    </>
  );
};

export default App;
