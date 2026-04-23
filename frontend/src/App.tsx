import { useReducer, useState, useEffect } from "react";
import { createContext, useContext } from "react";
import "./form.css";
import { LoginReducer } from "./reducers/login-reducer.tsx";

import { Home, Login } from "./main-pages.tsx";

export const UserContext = createContext(null);

const OldApp = () => {
  const [loginInfo, dispatch] = useReducer(LoginReducer, {
    status: false,
    user: "",
  });

  useEffect(() => {
    fetch("http://localhost:8080/get/checkUser", { credentials: "include" })
      .then((data) => data.json())
      .then((data) => {
        dispatch({ type: "init-user", content: data });
      });
  }, []);

  const handleUsersLogin = (content: string) => {
    dispatch({ type: "user-login", content });
  };
  return (
    <>
      {loginInfo.status ? (
        <UserContext value={loginInfo.user}>
          <Home />
        </UserContext>
      ) : (
        <Login handleUsersLogin={handleUsersLogin} />
      )}
    </>
  );
};

const SearchList = (searchList) => {
  console.log("entered");
  return (
    <ul className="List">
      {searchList.map((s) => (
        <li>
          <h1>{s.user}</h1>
          <button>{s.isSubscribed ? "Subscribed" : "Subscribe"}</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [searchData, setSearchData] = useState([]);
  const usersData = [
    { _id: 1, user: "Alex", isSubscribed: true },
    { _id: 2, user: "John", isSubscribed: false },
    { _id: 3, user: "Jai", isSubscribed: false },
    { _id: 4, user: "Jwitesh", isSubscribed: false },
  ];
  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      const lists = usersData.filter((x) => x.user.includes(value));
      setSearchData(lists);
    } else {
      setSearchData([]);
    }
  };
  return (
    <div className="search">
      <label>
        <h2>Search Users</h2>
      </label>
      <input type="text" onChange={handleSearch} />
      {searchData ? SearchList(searchData) : <p></p>}
      <button className="button-search">Search</button>
    </div>
  );
};

export default App;
