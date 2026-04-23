import { useReducer,useState, useEffect } from "react";
import { createContext, useContext } from "react";
import "./form.css";
import { formReducer, type PostData } from "./form-reducer.tsx";
import { Feed } from "./feed.tsx";
import { FormCreation } from "./form-creation.tsx";

const Home = () => {
  const [feedData, dispatch] = useReducer(formReducer, {
    nextId: 1,
    posts: [],
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/feedInfo")
      .then((data) => data.json())
      .then((data) => {
        dispatch({ type: "init-posts", content: data });
      });
  }, []);

  const handleAddPost = (content: PostData) => {
    dispatch({ type: "add-post", content });
  };

  const handleDeletePost = (id: number) => {
    dispatch({ type: "delete-post", content: id });
  };

  return (
    <div className="form">
      <FormCreation addPost={handleAddPost} />
      <Feed data={feedData} deletePost={handleDeletePost} />
    </div>
  );
};

const Login = ({ setLogin }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = formData.get("user")?.toString();
    alert(user);
    setLogin(true);
  };

  return (
    <div className="form">
      <h1>Login Page</h1>
      <form onSubmit={handleLogin} className="formData">
        <label>Username</label>
        <input name="user" type="text" />
        <label>Password</label>
        <input type="password" name="" id="" name="password" />
        <button className="loginButton">Login</button>
      </form>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setLogin] = useState(false);
  return <>{isLoggedIn ? <Home /> : <Login setLogin={setLogin} />}</>;
};

export default App;
