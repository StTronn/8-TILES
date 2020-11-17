import React from "react";

export default function Tile(props) {
  let { index, handleClick, correctPosition } = props;

  // uncomment to disable highlighting when tile is in correct position
  // correctPosition = false;

  if (props.value !== 0)
    return (
      <span
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          handleClick(index);
        }}
        className={`tile ${correctPosition && "tile-correct"}`}
      >
        {props.value}
      </span>
    );
  else return <span className="empty">.</span>;
}

