import "./form.css";
import { useContext } from "react";
import { useEffect, useReducer, useState, useRef } from "react";
import { UserContext } from "./App.tsx";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as api from "./api.tsx";

type AddPosts = {
  addPost: (content: PostData) => void;
};

const TABS = [
  { id: "text", label: "Text" },
  { id: "image", label: "Image" },
];

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

const getFileInfo = (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "readit");
  return data;
};

const CreationTags = ({ setActiveTab, activeTab }) => {
  return (
    <div className="tabs">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`tab ${activeTab === tab.id ? "tabActive" : ""}`}
        >
          {tab.label}
          {activeTab === tab.id && <span className="tabUnderline" />}
        </button>
      ))}
    </div>
  );
};

const TextDescription = ({ activeTab }) => {
  return (
    <>
      {activeTab === "text" && (
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Write your post..."
            rows={5}
          />
        </div>
      )}
    </>
  );
};

const Title = () => {
  return (
    <div className="field">
      <label htmlFor="title">
        Title <span className="required">*</span>
      </label>
      <input
        id="title"
        name="title"
        type="text"
        placeholder="Enter a title..."
        required
      />
    </div>
  );
};

export const FormCreation = ({ current, addPost }: AddPosts) => {
  const [activeTab, setActiveTab] = useState("text");
  const [preview, setPreview] = useState(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const userName = useContext(UserContext);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setUploading(true);
      try {
        const url = await api.fetchImageUrl(getFileInfo(file));
        setUrl(url);
      } catch (err) {
        console.log(err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (uploading) {
      alert("Image still uploading...");
      return;
    }
    const { userId, ...body } = getPostInfo(e, userName, current, url);
    addPost.mutate(body);
    alert("your post is uploaded")
  };

  return (
    <div className="formData ">
      <h1>Create Post</h1>

      <CreationTags setActiveTab={setActiveTab} activeTab={activeTab} />

      <form onSubmit={handleAddPost}>
        <Title />
        <TextDescription activeTab={activeTab} />

        {activeTab === "image" && (
          <div className="field">
            <label>Upload Image</label>

            <div
              className="dropZone"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} className="previewImg" />
              ) : (
                <span>Click to upload</span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={uploading}
            className={`btn ${uploading ? "" : "btnPrimary"}`}
          >
            {uploading ? "Loading..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};
