import React from "react";
import Tile from "./Tile";
import NameField from "./NameField";
import { shuffleGrid, calculateWinner } from "./shuffle";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { handleTouchMove, handleTouchStart } from "./swipe";
import * as io from "socket.io-client";
import BoardRender from "./BoardRender";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameObj: {},
      otherUser: {
        empty_i: 2,
        empty_j: 2,
        grid: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 0],
        ],
        could_be_won: false,
      },
      id: 1,
      username: "tronn",
      empty_i: 2,
      empty_j: 2,
      grid: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0],
      ],
      could_be_won: false,
      time: 0,
      waitTime: 0,
      solving: false,
      won: false,
      ready: false,
      gameOver: false,
    };
  }

  componentDidMount() {
    this.socket = io("http://localhost:8000");
    this.socket.on("connect", () => {
      this.setState({ id: this.socket.id });
    });
    const { roomId } = queryString.parse(this.props.location.search);
    if (!roomId) this.props.history.push("/multiplayer/?roomId=123");
    this.setState({ roomId });

    //socket emitters
    this.socket.emit("joinRoom", { roomId });

    //socket listners
    this.socket.on("initGame", (gameObj) => {
      console.log(gameObj);
      const { id } = this.state;
      this.startWait();
      setTimeout(() => {
        this.shuffleBoard(gameObj.users[id].grid);
        const otherId = getOtherId(id, gameObj);
        console.log(gameObj.users[otherId]);
        this.setState({ otherUser: gameObj.users[otherId] });
      }, 3000);
    });

    this.socket.on("updateObj", (gameObj) => {
      const { id } = this.state;
      const otherId = getOtherId(id, gameObj);
      this.setState({ otherUser: gameObj.users[otherId] });
    });

    this.socket.on("gameOver", () => {
      this.setState({ gameOver: true });
    });

    //event handler for controls
    document.addEventListener("keydown", this.handleChange);
    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", this.handleSwipe, false);
  }

  ready = () => {
    const { id, roomId, username } = this.state;
    this.setState({ ready: true }, () => {
      this.socket.emit("updateUser", {
        id,
        roomId,
        payload: { ready: true, username },
      });
    });
  };
  Ti;

  componentWillUnmount() {
    //this.stopClock();
  }
  startWait = () => {
    this.waitInterval = setInterval(this.incrementWait, 1000);
  };
  startClock = () => {
    this.interval = setInterval(this.increment, 1000);
  };

  stopClock = () => {
    window.clearInterval(this.interval);
  };

  increment = () => {
    this.setState((state) => ({ time: state.time + 1 }));
  };

  incrementWait = () => {
    const { waitTime } = this.state;
    if (waitTime == 3) {
      window.clearInterval(this.waitInterval);
      this.setState({ waitTime: 0 });
    } else this.setState({ waitTime: waitTime + 1 });
  };

  handleChange = (event, swipe = false, swipeKey = 0) => {
    const { could_be_won } = this.state;
    if (!could_be_won) return;
    let grid = this.state.grid;
    let empty_i = this.state.empty_i;
    let empty_j = this.state.empty_j;
    let key;
    if (!swipe) {
      key = event.keyCode;
    }
    if (swipe) key = swipeKey;
    let down = key === 40 && empty_i !== 0;
    let up = key === 38 && empty_i !== 2;
    let right = key === 39 && empty_j !== 0;
    let left = key === 37 && empty_j !== 2;

    if (down || up || right || left) {
      let i;
      let j;
      if (down) {
        i = empty_i - 1;
        j = empty_j;
      }
      if (up) {
        i = empty_i + 1;
        j = empty_j;
      }
      if (right) {
        i = empty_i;
        j = empty_j - 1;
      }
      if (left) {
        i = empty_i;
        j = empty_j + 1;
      }

      //swaping
      let temp = grid[empty_i][empty_j];
      grid[empty_i][empty_j] = grid[i][j];
      grid[i][j] = temp;
      this.setState({ grid: grid, empty_i: i, empty_j: j }, () => {
        const { id, roomId } = this.state;
        let correct = calculateWinner(this.state.grid);
        let won = correct && this.state.could_be_won;
        if (this.socket && roomId && could_be_won)
          this.socket.emit("updateUser", {
            id,
            roomId,
            payload: { ...this.state, ...{ won } },
          });
      });
    }
  };

  handleSwipe = (event) => {
    let value = handleTouchMove(event);
    this.handleChange(event, true, value);
  };

  shuffleBoard = (board) => {
    this.startClock();
    let grid = board ? board : shuffleGrid();
    let could_be_won = true;
    let i, j;
    let empty_i, empty_j;
    for (i = 0; i <= 2; i++)
      for (j = 0; j <= 2; j++)
        if (grid[i][j] === 0) {
          empty_i = i;
          empty_j = j;
          j = 2;
          i = 2;
        }
    this.setState({ grid, empty_i, empty_j, could_be_won });
  };

  reset = () => {
    let could_be_won = false;
    let grid = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ];
    this.stopClock();
    this.setState({ grid, could_be_won, empty_i: 2, empty_j: 2, time: 0 });
  };

  handleClick = (index) => {
    let { i, j } = index;
    let { empty_i, empty_j } = this.state;
    if (empty_i === i + 1 && empty_j === j) {
      this.handleChange(false, true, 40);
    }
    if (empty_i === i - 1 && empty_j === j) {
      this.handleChange(false, true, 38);
    }
    if (empty_j === j - 1 && empty_i === i) {
      this.handleChange(false, true, 37);
    }
    if (empty_j === j + 1 && empty_i === i) {
      this.handleChange(false, true, 39);
    }
  };

  // calculates whether this tile is in the correct position.
  // works for any potential future board sizes, not just 3x3
  calculateTileCorrect = (i, j, value) => {
    // assuming all rows will have the same amount of tiles
    const tilesPerRow = this.state.grid[0].length;
    const correctPosition = i * tilesPerRow + (j + 1);

    return value === correctPosition;
  };

  handleUsername = (username) => {
    this.setState({ username });
  };

  render() {
    const { gameOver, ready, waitTime, could_be_won } = this.state;
    let correct = calculateWinner(this.state.grid);
    let won = correct && this.state.could_be_won;
    let minutes = Math.floor(this.state.time / 60);
    let seconds = this.state.time % 60;
    // check whether we need to add a leading zero
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let formattedTime = `${minutes} : ${seconds}`;
    if (!won && !gameOver)
      return (
        <div
          className="grid grid-cols-2 gap-x-32"
          style={{ maxWidth: "fit-content" }}
        >
          <div>
            <div className="card">
              <div className="board">
                {
                  //box section
                  this.state.grid.map((list, i) => {
                    return (
                      <div key={i}>
                        {list.map((item, j) => {
                          let index = {
                            i,
                            j,
                          };
                          return (
                            <Tile
                              value={this.state.grid[i][j]}
                              key={j}
                              index={index}
                              handleClick={this.handleClick}
                              correctPosition={this.calculateTileCorrect(
                                i,
                                j,
                                this.state.grid[i][j]
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
            <div>
              <button
                className="w-full"
                onClick={correct ? this.ready : () => {}}
              >
                {waitTime !== 0 && `Starting in ${waitTime}`}
                {!waitTime &&
                  (!ready
                    ? "Ready"
                    : could_be_won
                    ? "Put tiles in order"
                    : "Waiting...")}
              </button>
            </div>
            <NameField
              username={this.state.username}
              handleUsername={this.handleUsername}
            />
          </div>
          <BoardRender
            grid={this.state.otherUser.grid}
            username={this.state.otherUser.username}
            could_be_won={this.state.otherUser.could_be_won}
            time={this.state.time}
            calculateTileCorrect={this.calculateTileCorrect}
          />
        </div>
      );
    else {
      this.stopClock();
      document.removeEventListener("keydown", this.handleChange);
      document.removeEventListener("touchstart", handleTouchStart, false);
      document.removeEventListener("touchmove", this.handleSwipe, false);

      return (
        <div
          className="grid grid-cols-2 gap-x-32"
          style={{ maxWidth: "fit-content" }}
        >
          <div>
            <div className="card">
              <div className="board">
                {
                  //box section
                  this.state.grid.map((list, i) => {
                    return (
                      <div key={i}>
                        {list.map((item, j) => {
                          return (
                            <Tile
                              value={this.state.grid[i][j]}
                              key={j}
                              correctPosition={this.calculateTileCorrect(
                                i,
                                j,
                                this.state.grid[i][j]
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
            <div
              style={{
                display: "grid",
                justifyItems: "center",
              }}
            >
              {won && (
                <h1 className="text-lg font-medium my-8">
                  You won in {formattedTime}
                </h1>
              )}
              {!won && (
                <h1 className="text-lg font-medium my-8">
                  Better Luck next time
                </h1>
              )}
              <button
                onClick={() => {
                  window.location.reload();
                }}
              >
                Play Again
              </button>
            </div>
          </div>

          <BoardRender
            grid={this.state.otherUser.grid}
            username={this.state.otherUser.username}
            could_be_won={this.state.otherUser.could_be_won}
            time={this.state.time}
            calculateTileCorrect={this.calculateTileCorrect}
          />
        </div>
      );
    }
  }
}

const getOtherId = (id, gameObj) => {
  const key0 = Object.keys(gameObj.users)[0];
  const key1 = Object.keys(gameObj.users)[1];
  return id === key0 ? key1 : key0;
};

const BoardWithRouter = withRouter(Board);
export default BoardWithRouter;
