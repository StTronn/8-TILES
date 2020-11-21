import React from "react";
import Tile from "./Tile";
import { calculateWinner } from "./shuffle";

export default class BoardRender extends React.Component {
  render() {
    const {
      grid,
      could_be_won,
      time,
      calculateTileCorrect,
      username,
    } = this.props;
    let correct = calculateWinner(grid);
    let won = correct && could_be_won;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    // check whether we need to add a leading zero
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let formattedTime = `${minutes} : ${seconds}`;

    if (!won)
      return (
        <div>
          <div className="card">
            <div className="board">
              {
                //box section
                grid.map((list, i) => {
                  return (
                    <div key={i}>
                      {list.map((item, j) => {
                        let index = {
                          i,
                          j,
                        };
                        return (
                          <Tile
                            value={grid[i][j]}
                            key={j}
                            index={index}
                            handleClick={() => {}}
                            correctPosition={calculateTileCorrect(
                              i,
                              j,
                              grid[i][j]
                            )}
                          />
                        );
                      })}
                    </div>
                  );
                })
              }
            </div>
            <div className="clock">
              <h3>{formattedTime}</h3>
            </div>
          </div>
          {username && (
            <button className="w-full bg-cm-dark-light">{username}</button>
          )}
        </div>
      );
    else {
      return (
        <div>
          <div className="card">
            <div className="board">
              {
                //box section
                grid.map((list, i) => {
                  return (
                    <div key={i}>
                      {list.map((item, j) => {
                        return (
                          <Tile
                            value={grid[i][j]}
                            key={j}
                            correctPosition={calculateTileCorrect(
                              i,
                              j,
                              grid[i][j]
                            )}
                          />
                        );
                      })}
                    </div>
                  );
                })
              }
            </div>
            <div className="clock">
              <h3>{formattedTime}</h3>
            </div>
          </div>
        </div>
      );
    }
  }
}
