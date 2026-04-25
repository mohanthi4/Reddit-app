import { useReducer, useState, useEffect } from "react";
import * as api from "./api.tsx";

const SearchList = ({
  searchList,
  handleSubscribeUser,
  handleUnSubscribeUser,
}) => {
  const handleSubscribe = (e, id) => {
    api.addSubscriber(id);
    handleSubscribeUser(id);
  };

  const handleUnSubscribe = (e, id) => {
    api.UnSubscriber(id);
    handleUnSubscribeUser(id);
  };

  return (
    <ul className="lists">
      {searchList.map((s) => (
        <li key={s.id}>
          <h1>{s.user}</h1>
          {s.isSubscribe ? (
            <button
              className="green"
              onClick={(e) => handleUnSubscribe(e, s.id)}
            >
              Subscribed ✓
            </button>
          ) : (
            <button className="blue" onClick={(e) => handleSubscribe(e, s.id)}>
              Subscribe
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

const getFilteredUsers = (usersData, value) =>
  value ? usersData.filter((x) => x.user.includes(value)) : [];

export const SearchLabel = ({
  usersData,
  handleSubscribeUser,
  handleUnSubscribeUser,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [searchIds, setSearchIds] = useState([]);

  const handleSearch = () => {
    const ids = inputValue
      ? usersData.filter((x) => x.user.includes(inputValue)).map((x) => x.id)
      : [];

    setSearchIds(ids);
  };

  const filteredUsers = usersData.filter((u) => searchIds.includes(u.id));

  return (
    <div className="search posts">
      <label>
        <h2>Search Users</h2>
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {filteredUsers.length > 0 && (
        <SearchList
          searchList={filteredUsers}
          handleSubscribeUser={handleSubscribeUser}
          handleUnSubscribeUser={handleUnSubscribeUser}
        />
      )}
      <button className="button-search" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};
