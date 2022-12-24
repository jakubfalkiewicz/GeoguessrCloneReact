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
    if (!game.pan) {
      panorama.addEventListener("click", () => {
        panorama.style.pointerEvents = "none";
      });
      panorama.click();
    }
  });

  const location = game.locations[round];

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  const options = {
    //COMPASS
    panControl: true,
    // panControlOptions: {
    //   position: google.maps.ControlPosition.LEFT_BOTTOM,
    // },
    draggable: game.pan,
    zoomControl: game.zoom,
    //ROAD ARROWS
    linksControl: game.move,
    //ZOOM
    scrollwheel: game.zoom,
    //MOVING
    clickToGo: game.move,
    //SHOW ADDRESS
    addressControl: false,
    //ROAD NAMES
    showRoadLabels: false,
    //ADDONS
    fullscreenControl: false,
    motionTrackingControl: true,
    enableCloseButton: false,
    visible: true,
  };
  if (!game.move) {
    window.addEventListener(
      "keydown",
      (event) => {
        if (
          // Change or remove this condition depending on your requirements.
          (event.key === "ArrowUp" || // Move forward
            event.key === "ArrowDown" || // Move forward
            event.key === "ArrowLeft" || // Pan left
            event.key === "ArrowRight") && // Pan right // Zoom out
          !event.metaKey &&
          !event.altKey &&
          !event.ctrlKey
        ) {
          event.stopPropagation();
        }
      },
      { capture: true }
    );
  }

  return (
    <div className="panorama-container">
      <GoogleMap center={center} zoom={10}>
        <StreetViewPanorama
          id="street-view"
          position={center}
          visible={true}
          options={options}
        />
      </GoogleMap>
      <div id="startingPoint" aria-label="Starting point">
        <img
          src="https://www.geoguessr.com/_next/static/images/icon-return-to-start-3b4eed3225adfd860a4ed3726ad1e05a.svg"
          alt="backToStart"
        />
      </div>
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
