import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getGamesList } from "../ducks/games/actions";
import { GoogleMap, StreetViewPanorama, Marker } from "@react-google-maps/api";

const GameLogic = ({ games }) => {
  const [round, setRound] = useState(0);
  const [roundSummary, setRoundSummary] = useState(false);
  const [roundScore, setRoundScore] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const { id } = useParams();
  const [markers, setMarkers] = useState([]);
  const [solutionMarkers, setSolutionMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const [mapSize, setMapSize] = useState(null);
  const [distance, setDistance] = useState(null);

  let game =
    games.filter((game) => game.id === id)[0] ||
    JSON.parse(localStorage.getItem(`game${id}`));

  const onLoad = useCallback((map) => {
    map.setOptions({
      draggableCursor: "crosshair",
      gestureHandling: "greedy",
      streetViewControl: false,
      fullscreenControl: false,
      disableDefaultUI: true,
      clickableIcons: false,
    });
    setMap(map);
  }, []);

  const onMapClick = useCallback((e) => {
    setMarkers([
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    ]);
  }, []);

  useEffect(() => {
    if (games.length !== 0) {
      localStorage.setItem(`game${id}`, JSON.stringify(game));
    }
    const panorama =
      document.getElementById("panorama-container").childNodes[0];

    if (!game.pan) {
      panorama.addEventListener("click", () => {
        panorama.style.pointerEvents = "none";
      });
      panorama.click();
    }
  });

  const location = game.locations[round];

  const addSolutionMarker = () => {
    setMarkers((current) => [
      ...current,
      {
        lat: location.lat,
        lng: location.lng,
        url: `https://www.google.com/maps?q&layer=c&cbll=${location.lat},${location.lng}`,
      },
    ]);
    setSolutionMarkers(markers);
  };

  const addPolyLine = (markersCoordinates) => {
    const lineSymbol = {
      path: "M 0,0 0,0",
      strokeOpacity: 1,
      scale: 3,
    };
    const markersLinePath = new window.google.maps.Polyline({
      path: markersCoordinates,
      geodesic: true,
      strokeColor: "#FFFFF",
      strokeOpacity: 0,
      icons: [
        {
          icon: lineSymbol,
          offset: "0",
          repeat: "5px",
        },
      ],
    });
    markersLinePath.setMap(map);
  };

  const zoomFitBounds = (boundsList) => {
    const bounds = new window.google.maps.LatLngBounds();
    boundsList.forEach((coord) => {
      bounds.extend(coord);
    });
    map.fitBounds(bounds);
  };

  const getDistacneInUnits = () => {
    if (parseFloat(distance).toFixed(1) > 2000) {
      return `${(parseFloat(distance) / 1000).toFixed(1)} KM`;
    }
    if (parseFloat(distance).toFixed(1) > 10000) {
      return `${parseInt(distance / 1000)} KM`;
    }
    if (parseFloat(distance).toFixed(1) <= 2000) {
      return `${parseInt(distance)} M`;
    }
  };

  const getRoundScore = (dist) => {
    console.log(dist);
    const exponent = 0.9893391207 ** parseFloat(dist / 1000);
    console.log(exponent);
    setRoundScore(parseInt(5000 * exponent));

    // roundPoints.innerHTML = `${parseInt(5000 * exponent)
    //   .toString()
    //   .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} points`;
    // progressBar.style = `width:${
    //   parseFloat(parseInt(5000 * exponent) / 5000) * 100
    // }%`;
    // points.innerHTML = `${
    //   parseInt(points.innerHTML) + parseInt(5000 * exponent)
    // }`;
  };

  const handleGuess = () => {
    const solutionPosition = new window.google.maps.LatLng(
      location.lat,
      location.lng
    );
    const markerPosition = new window.google.maps.LatLng(
      markers[0].lat,
      markers[0].lng
    );

    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        solutionPosition,
        markerPosition
      );
    setDistance(distance);
    addSolutionMarker();
    addPolyLine([solutionPosition, markerPosition]);
    zoomFitBounds([solutionPosition, markerPosition]);
    setRoundSummary(true);
    setMapSize({
      height: "100vh",
      width: "100vw",
    });
    getRoundScore(distance);
  };

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  const panoramaContainerStyle = {
    height: "100vh",
    width: "100vw",
  };

  const panoramaOptions = {
    //COMPASS
    panControl: true,
    //ZOOM BUTTONS
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
    <div>
      <div id="panorama-container">
        <GoogleMap
          center={center}
          zoom={10}
          mapContainerStyle={panoramaContainerStyle}
        >
          <StreetViewPanorama
            id="street-view"
            position={center}
            visible={true}
            options={panoramaOptions}
          />
        </GoogleMap>
        <div id="startingPoint" aria-label="Starting point">
          <img
            src="https://www.geoguessr.com/_next/static/images/icon-return-to-start-3b4eed3225adfd860a4ed3726ad1e05a.svg"
            alt="backToStart"
          />
        </div>
      </div>
      <div id={"map-container"} className={roundSummary ? "active" : ""}>
        <GoogleMap
          id="map"
          mapContainerStyle={
            mapSize || {
              height: "210px",
              width: "250px",
            }
          }
          zoom={3}
          center={
            markers.length > 0
              ? {
                  lat: map.center.lat(),
                  lng: map.center.lng(),
                }
              : { lat: 0, lng: 0 }
          }
          onClick={!roundSummary ? onMapClick : {}}
          onLoad={onLoad}
        >
          {markers.length > 0 &&
            markers.map((marker) => (
              <Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={
                  marker.url
                    ? {
                        url: `https://www.geoguessr.com/_next/static/images/correct-location-4da7df904fc6b08ce841e4ce63cd8bfb.png`,
                        scaledSize: new window.google.maps.Size(25, 25),
                      }
                    : null
                }
                onClick={() =>
                  marker.url ? window.open(marker.url, "_blank") : {}
                }
              />
            ))}
        </GoogleMap>
        {(markers.length === 0 || markers.length % 2 !== 0) && (
          <button
            id="confirmButton"
            onClick={() => {
              markers.length > 0 ? handleGuess() : console.log("no marker");
            }}
          >
            {markers.length > 0 ? "GUESS" : "PLACE YOUR PIN ON THE MAP"}
          </button>
        )}
        {markers.length > 0 && markers.length % 2 === 0 && (
          <div className="scoreboard">
            <div className="roundPoints">{roundScore} points</div>
            <div id="progressBar" max="100">
              <div
                id="progress"
                style={{
                  width: `${parseFloat(parseInt(roundScore) / 5000) * 100}%`,
                }}
              ></div>
            </div>
            <div className="score">
              Your guess was {getDistacneInUnits()} away
            </div>
            <button id="nextRound">NEXT ROUND</button>
          </div>
        )}
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
