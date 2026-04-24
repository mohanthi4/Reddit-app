import { useReducer, useState, useEffect } from "react";
import { subscribersReduce } from "./reducers/search-reducer.tsx";

const SearchList = ({ searchList }) => {
  return (
    <ul className="lists">
      {searchList.map((s) => (
        <li key={s.id}>
          <h1>{s.user}</h1>
          {s.isSubscribe ? (
            <button className="green">Subscribed ✓</button>
          ) : (
            <button className="blue">Subscribe</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export const SearchLabel = ({ usersData }) => {
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
      {searchData.length > 0 ? <SearchList searchList={searchData} /> : <p></p>}
      <button className="button-search">Search</button>
    </div>
  );
};
