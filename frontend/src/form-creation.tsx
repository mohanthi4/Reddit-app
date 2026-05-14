import "./form.css";
import { useContext } from "react";
import { useEffect, useReducer, useState } from "react";
import { UserContext } from "./App.tsx";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleAddPost = (e) => {
    e.preventDefault();
    if (uploading) {
      alert("Image still uploading...");
      return;
    }
    const posts = getPostInfo(e, userName, current, url);
    const { userId, ...body } = posts;
    addPost.mutate(body);
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "readit");

      fetch("https://api.cloudinary.com/v1_1/du6mwwqgr/image/upload", {
        method: "post",
        body: data,
      })
        .then((resp) => resp.json())
        .then((data) => {
          setUrl(data.url);
          setUploading(false);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="formData ">
      <h1>Create Post</h1>
      <form onSubmit={handleAddPost} className="formData">
        <label>Title</label>
        <input name="title" type="text" placeholder="Enter a title..." />
        <label>Body</label>
        <textarea
          name="description"
          placeholder="Write your post..."
        ></textarea>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={uploadImage}
          />
        </Button>

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
