import "./form.css";
import { useContext } from "react";
import { UserContext } from "./App.tsx";

type AddPosts = {
  addPost: (content: PostData) => void;
};

const getPostInfo = (e, userName) => {
  const user = userName;
  const formData = new FormData(e.target);
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const date = new Date().toString();
  return { user, title, description, date };
};

export const FormCreation = ({ addPost }: AddPosts) => {
  const userName = useContext(UserContext);
  const handleAddPost = (e) => {
    e.preventDefault();
    const posts = getPostInfo(e, userName);
    fetch("http://localhost:8080/post/addPost", {
      method: "post",
      body: JSON.stringify(posts),
      credentials:"include"
    })
      .then((x) => x.json())
      .catch((e) => console.log(e));
    addPost(posts);
  };

  return (
    <div className="formData posts">
      <h1>Create Post</h1>
      <form onSubmit={handleAddPost} className="formData">
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
  );
};
