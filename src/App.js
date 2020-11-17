import React from "react";
import "./board.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { Board } from "./Board";
import MultiBoard from "./MultiBoard";
import Mode from "./Mode";

const Heading = styled.h1`
  letter-spacing: 0.2em;
`;

function App() {
  return (
    <div className="grid justify-items-center">
      <Heading className="text-2xl font-semibold my-4 ">8-TILES</Heading>
      <Mode />
      <Router>
        <Switch>
          <Route path="/multiplayer">
            <>
              <MultiBoard />
            </>
          </Route>
          <Route path="/">
            <div>
              <Board />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
