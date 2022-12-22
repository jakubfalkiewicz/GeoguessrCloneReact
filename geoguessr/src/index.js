import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { applyMiddleware, combineReducers, createStore } from "redux";
import gamesReducer from "./ducks/games/reducers";
import mapsReducer from "./ducks/maps/reducers";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import logger from "redux-logger";

const store = createStore(
  combineReducers({
    games: gamesReducer,
    maps: mapsReducer,
  }),
  applyMiddleware(thunk, logger)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

reportWebVitals();
