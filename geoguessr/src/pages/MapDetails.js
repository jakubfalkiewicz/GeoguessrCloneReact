import React, { useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { createGame } from "../ducks/games/actions";

const MapDetails = ({ maps, createGame }) => {
  //REDUX CLEARS STATE WHEN GOING BACK - to fix
  const newGameID = uuidv4();
  const { id } = useParams();
  // console.log(id);
  const map = maps.filter((map) => map._id === id)[0];
  // console.log(maps);
  const [move, setMove] = useState(true);
  const [pan, setPan] = useState(true);
  const [zoom, setZoom] = useState(true);

  return (
    <div>
      {map && map.locationsList && (
        <div>
          <div>Map {id}</div>
          <div>{map.name}</div>
          <div>{map.description}</div>
          <div>{map.locationsList.length} locations</div>
        </div>
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
          <div className="switch-col">
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
          </div>
        </div>
        <button
          id="startGame"
          onClick={() => {
            const random = map.locationsList
              .sort(() => 0.5 - Math.random())
              .slice(0, 5);
            createGame({
              id: newGameID,
              move: move,
              pan: pan,
              zoom: zoom,
              time: 0,
              player: "Jan",
              locations: random,
              currentRound: 1,
            });
          }}
        >
          <Link to={`../../game/${uuidv4()}`}>START GAME</Link>
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  // const { id } = useParams();
  // const map = state.maps.filter((map) => map._id === id);
  // const owner = state.users.filter(user => user.id === car[0].owner_id)[0]

  return {
    // map: map,
    maps: state.maps,
  };
};

const mapDispatchToProps = {
  createGame,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapDetails);
