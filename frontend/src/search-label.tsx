import { useEffect, useReducer, useState } from "react";
import * as api from "./api.tsx";

import { alpha, styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

const SearchList = ({ searchList, userActions }) => {
  const handleSubscribe = (e, id) => {
    api.addSubscriber(id);
    userActions.handleSubscribeUser(id);
  };

  const handleUnSubscribe = (e, id) => {
    api.UnSubscriber(id);
    userActions.handleUnSubscribeUser(id);
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

export const SearchLabel = ({ usersData, userActions }) => {
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
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #ddd",
        color: "black",
        width: "100%",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* LEFT → Search */}
        <Typography sx={{ color: "black", fontWeight: "bold" }}>
          Readit
        </Typography>
        {/* RIGHT → Title */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "2px 8px",
            width: "300px",
          }}
        >
          <InputBase
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ color: "black", width: "100%" }}
            startAdornment={
              <InputAdornment position="start">
                <IconButton onClick={handleSearch}>
                  <SearchIcon sx={{ color: "black" }} />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
        {filteredUsers.length > 0 && (
          <SearchList searchList={filteredUsers} userActions={userActions} />
        )}
      </Toolbar>
    </AppBar>
  );
};
