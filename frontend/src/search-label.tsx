import { useReducer, useState, useEffect } from "react";

const SearchList = ({ searchList, handleSubscribeUser }) => {
  const handleSubscribe = (e, id) => {
    fetch("http://localhost:8080/post/addSubscriber", {
      method: "post",
      body: JSON.stringify(id),
      credentials: "include",
    })
      .then((x) => x.json())
      .catch((e) => console.error(e));
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

export const SearchLabel = ({ usersData, handleSubscribeUser }) => {
  const [searchData, setSearchData] = useState([]);

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
    <div className="search posts">
      <label>
        <h2>Search Users</h2>
      </label>
      <input type="text" onChange={handleSearch} />
      {searchData.length > 0 ? (
        <SearchList
          searchList={searchData}
          handleSubscribeUser={handleSubscribeUser}
        />
      ) : (
        <p></p>
      )}
      <button className="button-search">Search</button>
    </div>
  );
};
