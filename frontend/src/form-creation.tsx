import "./form.css";
import { useContext } from "react";
import { useEffect, useReducer, useState } from "react";
import { UserContext } from "./App.tsx";
import { format } from "date-fns";

type AddPosts = {
  addPost: (content: PostData) => void;
};

const getPostInfo = (e, userName, current, preview) => {
  const formData = new FormData(e.target);
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const date = format(new Date(), "MMMM d, yyyy '-' h:mm a");
  return {
    user: userName,
    userId: current,
    title,
    description,
    date,
    likes: 0,
    likedUsers: [],
    image: preview,
  };
};

export const FormCreation = ({ current, addPost }: AddPosts) => {
  const userName = useContext(UserContext);
  const [preview, setPreview] = useState(null);

  const handleAddPost = (e) => {
    e.preventDefault();
    const posts = getPostInfo(e, userName, current, preview);
    const { userId, ...body } = posts;
    addPost.mutate(body);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "300px", marginTop: "10px", marginLeft: "30px" }}
          />
        )}
        <button>Post</button>
      </form>
    </div>
  );
};
