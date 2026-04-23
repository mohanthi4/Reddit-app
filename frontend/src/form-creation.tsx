import "./form.css";

type AddPosts = {
  addPost: (content: PostData) => void;
};

const getPostInfo = (e) => {
  const user = "Alex";//get the user name from context
  const formData = new FormData(e.target);
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const date = new Date().toString();
  return { user, title, description, date };
};

export const FormCreation = ({ addPost }: AddPosts) => {
  const handleAddPost = (e) => {
    e.preventDefault();
    const posts = getPostInfo(e);
    fetch("http://localhost:8080/post/addPost", {
      method: "post",
      body: JSON.stringify(posts),
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
