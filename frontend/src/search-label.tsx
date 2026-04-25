import { useReducer, useState, useEffect } from "react";
import * as api from "./api.tsx";

const SearchList = ({ searchList, handleSubscribeUser }) => {
  const handleSubscribe = (e, id) => {
    api.addSubscriber(id);
    handleSubscribeUser(id);
  };

  return (
    <ul className="lists">
      {searchList.map((s) => (
        <li key={s.id}>
          <h1>{s.user}</h1>
          {s.isSubscribe ? (
            <button className="green" disabled>
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

export const SearchLabel = ({ usersData, handleSubscribeUser }) => {
  const [searchData, setSearchData] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    const lists = getFilteredUsers(usersData, value);
    setSearchData(lists);
  };

  return (
    <div className="search posts">
      <label>
        <h2>Search Users</h2>
      </label>
      <input type="text" onChange={handleSearch} />
      {searchData.length > 0 && (
        <SearchList
          searchList={searchData}
          handleSubscribeUser={handleSubscribeUser}
        />
      )}
      <button className="button-search">Search</button>
    </div>
  );
};
