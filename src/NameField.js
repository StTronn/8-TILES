import React from "react";

export default ({ username, handleUsername }) => {
  return (
    <input
      onChange={(e) => handleUsername(e.target.value)}
      value={username}
      style={{ width: "209.9px", padding: "1rem 2rem" }}
      class="in block bg-cm-dark-light text-base placeholder-white focus:placeholder-white ..."
      placeholder="Enter your name"
    />
  );
};
