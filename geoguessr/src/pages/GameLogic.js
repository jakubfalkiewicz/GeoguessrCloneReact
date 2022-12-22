import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getGamesList } from "../ducks/games/actions";
import { GoogleMap, StreetViewPanorama } from "@react-google-maps/api";

const GameLogic = ({ games }) => {
  const [round, setRound] = useState(0);
  const { id } = useParams();
  let game =
    games.filter((game) => game.id === id)[0] ||
    JSON.parse(localStorage.getItem(`game${id}`));

  useEffect(() => {
    if (games.length !== 0) {
      localStorage.setItem(`game${id}`, JSON.stringify(game));
    }
    const panorama = document.querySelector(".panorama-container")
      .childNodes[0];
    panorama.style.width = "100%";
    panorama.style.height = "100vh";
  });

  const location = game.locations[round];

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  const options = {};

  return (
    <div className="panorama-container">
      <GoogleMap center={center} zoom={10}>
        <StreetViewPanorama id="street-view" position={center} visible={true} />
      </GoogleMap>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    games: state.games,
  };
};

const mapDispatchToProps = {
  // createGame,
  getGamesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameLogic);
