import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createGame } from "../ducks/games/actions";
import { getMapsList } from "../ducks/maps/actions";
import { v4 as uuidv4 } from "uuid";

const MapDetails = ({ maps, createGame }) => {
  const [gameID, setGameID] = useState(uuidv4());
  useEffect(() => {
    if (maps.length === 0) {
      setGameID(uuidv4());
    }
    window.addEventListener("popstate", () => {
      window.location.reload();
    });
  }, []);

  const { id } = useParams();
  const map = maps.filter((map) => map._id === id)[0];
  const [move, setMove] = useState(true);
  // const [pan, setPan] = useState(true);
  // const [zoom, setZoom] = useState(true);

  const createNewGame = async () => {
    const random = map.locationsList
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);
    await createGame({
      gameId: gameID,
      time: 0,
      player: "639c73bbb0ef36ed25560b5d",
      mapId: id,
      move: move,
      pan: true,
      zoom: true,
      locations: random,
      currentRound: 1,
      roundsList: [],
      timesList: [],
      country: map?.country,
    });
    const start = document.getElementById("start");
    setTimeout(() => start.click(), 3000);
  };

  return (
    <div>
      {map && map.locationsList ? (
        <div>
          <div>Map {id}</div>
          <div>{map.name}</div>
          <div>{map.description}</div>
          <div>{map.locationsList.length} locations</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div className="menu-options">
        <div className="white start">Start a new game</div>

        <div className="options-container">
          <div className="switch-col">
            <div>MOVE</div>
            <input
              type="checkbox"
              checked={move}
              onChange={() => setMove(!move)}
            />
          </div>
          {/* <div className="switch-col">
            <div>PAN</div>
            <input
              type="checkbox"
              checked={pan}
              onChange={() => setPan(!pan)}
            />
          </div>
          <div className="switch-col">
            <div>ZOOM</div>
            <input
              type="checkbox"
              checked={zoom}
              onChange={() => setZoom(!zoom)}
            />
          </div> */}
        </div>
        <button id="startGame" onClick={() => createNewGame(gameID)}>
          START GAME
        </button>
        <Link id="start" to={`../../game/${gameID}`}></Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    maps: state.maps,
  };
};

const mapDispatchToProps = {
  createGame,
  getMapsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapDetails);
