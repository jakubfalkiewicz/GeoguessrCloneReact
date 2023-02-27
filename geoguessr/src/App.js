import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import MapRoutes from "./components/MapRoutes";
import GameRoutes from "./components/GameRoutes";
import SignUp from "./pages/SignUp";
import { useEffect } from "react";
import { connect } from "react-redux";
import { getUsersList } from "./ducks/users/actions";
import { getMapsList } from "./ducks/maps/actions";
import { getGamesList } from "./ducks/games/actions";
import LogIn from "./pages/LogIn";

function App({ users, maps, games }) {
  useEffect(() => {
    if (users.length < 1) {
      getUsersList();
    }
    if (maps.length < 1) {
      getMapsList();
    }
    if (games.length < 1) {
      getGamesList();
    }
  }, [users, maps, games]);
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/login" element={<LogIn />}></Route>
      <Route path="/maps/*" element={<MapRoutes />}></Route>
      <Route path="/game/*" element={<GameRoutes />}></Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}
const mapStateToProps = (state, props) => {
  return {
    users: state.users,
    maps: state.maps,
    games: state.games,
  };
};

const mapDispatchToProps = {
  getUsersList,
  getMapsList,
  getGamesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
