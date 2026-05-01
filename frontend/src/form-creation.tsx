import "./form.css";
import { useContext } from "react";
import { UserContext } from "./App.tsx";
import { format } from "date-fns";

type AddPosts = {
  addPost: (content: PostData) => void;
};

const getPostInfo = (e, userName, current) => {
  const user = userName;
  const formData = new FormData(e.target);
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const date = format(new Date(), "MMMM d, yyyy '-' h:mm a");
  const likes = 0;
  const likedUsers = [];
  return { user, userId: current, title, description, date, likes, likedUsers };
};

export const FormCreation = ({ current, addPost }: AddPosts) => {
  const userName = useContext(UserContext);

  const handleAddPost = (e) => {
    e.preventDefault();
    const posts = getPostInfo(e, userName, current);
    const { userId, ...body } = posts;
    addPost.mutate(body);
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
