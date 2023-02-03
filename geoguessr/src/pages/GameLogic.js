import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getGamesList, editGame } from "../ducks/games/actions";
import {
  GoogleMap,
  StreetViewPanorama,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { Link } from "react-router-dom";

const GameLogic = ({ editGame, games, maps }) => {
  const [round, setRound] = useState(1);
  const [roundScore, setRoundScore] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const { id } = useParams();
  const [markers, setMarkers] = useState([]);
  const [summaryMarkers, setSummaryMarkers] = useState([]);
  const [map, setMap] = useState(null);
  const [mapSize, setMapSize] = useState(null);
  const [distance, setDistance] = useState(null);
  const [backToStart, setBackToStart] = useState(null);

  let game =
    games.filter((game) => game.gameId === id)[0] ||
    JSON.parse(localStorage.getItem(`game${id}`));

  // setRound(game.currentRound)

  //REACT-GOOGLE-MAPS-COMPONENTS-OPTIONS
  const mapOptions = {
    draggableCursor: "crosshair",
    gestureHandling: "greedy",
    streetViewControl: false,
    fullscreenControl: false,
    disableDefaultUI: true,
    clickableIcons: false,
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
  const polyLineOptions = {
    geodesic: true,
    strokeColor: "#FFFFF",
    strokeOpacity: 0,
    icons: [
      {
        icon: {
          path: "M 0,0 0,0",
          strokeOpacity: 1,
          scale: 3,
        },
        offset: "0",
        repeat: "5px",
      },
    ],
  };

  const onMapLoad = useCallback((map) => {
    map.setOptions(mapOptions);
    setMap(map);
    const bounds = new window.google.maps.LatLngBounds();
    game.locations.forEach((loc) =>
      bounds.extend({ lat: loc.lat, lng: loc.lng })
    );
    map.fitBounds(bounds);
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
    // console.log(markersLinePath);
    console.log(markers);
    if (games.length !== 0) {
      localStorage.setItem(`game${id}`, JSON.stringify(game));
    }
    const panorama =
      document.getElementById("panorama-container").childNodes[0];

    // if (!game.pan) {
    //   panorama.addEventListener("click", () => {
    //     panorama.style.pointerEvents = "none";
    //   });
    //   panorama.click();
    // }
  });

  const location = game.locations[round - 1];

  const addSolutionMarker = () => {
    const solMarker = {
      lat: location.lat,
      lng: location.lng,
      url: `https://www.google.com/maps?q&layer=c&cbll=${location.lat},${location.lng}`,
    };
    markers.push(solMarker);
    summaryMarkers.push(markers);
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
    //https://www.reddit.com/r/geoguessr/comments/7ekj80/for_all_my_geoguessing_math_nerds/
    const exponent = 0.9893391207 ** parseFloat(dist / 1000);
    setRoundScore(parseInt(5000 * exponent) + 1);
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

    game.currentRound++;
    game.roundsList.push([solutionPosition, markerPosition]);

    editGame(game);
    setDistance(distance);
    addSolutionMarker();
    zoomFitBounds([solutionPosition, markerPosition]);
    setMapSize({
      height: "100vh",
      width: "100vw",
    });
    getRoundScore(distance);
  };

  const nextRound = () => {
    if (round === game.locations.length) {
      console.log(summaryMarkers);
      const summaryMarkersFlattened = summaryMarkers.flat();
      setGameScore(gameScore + roundScore);
      setMarkers(summaryMarkersFlattened);
      zoomFitBounds(summaryMarkersFlattened);
    } else {
      setMarkers([]);
      setRound(round + 1);
      setMapSize(null);
      setGameScore(gameScore + roundScore);
      map.setZoom(1);
    }
  };

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  const panoramaContainerStyle = {
    height: "100vh",
    width: "100vw",
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
  //PREVENT PANORAMA FROM GOING TO START POINT UNINTENTIONALLY
  const panoMap = useMemo(
    () => (
      <GoogleMap
        center={center}
        zoom={1}
        mapContainerStyle={panoramaContainerStyle}
      >
        <StreetViewPanorama
          id="street-view"
          position={center}
          visible={true}
          // onLoad={onPanoramaLoad}
          options={panoramaOptions}
        />
      </GoogleMap>
    ),
    [round, backToStart]
  );

  return (
    <div>
      <div id="panorama-container">
        {panoMap}
        <div
          id="startingPoint"
          aria-label="Starting point"
          onClick={() => {
            setBackToStart(backToStart + 1);
          }}
        >
          <img
            src="https://www.geoguessr.com/_next/static/images/icon-return-to-start-3b4eed3225adfd860a4ed3726ad1e05a.svg"
            alt="backToStart"
          />
        </div>
        <div className="score-board">
          <div>
            <div>Round</div>
            <div>{round}</div>
          </div>
          <div>
            <div>Score</div>
            <div>{gameScore}</div>
          </div>
        </div>
      </div>
      <div id={"map-container"} className={markers.length > 1 ? "active" : ""}>
        <GoogleMap
          id="map"
          mapContainerStyle={
            mapSize || {
              height: "210px",
              width: "250px",
            }
          }
          zoom={1}
          center={
            markers.length > 0
              ? {
                  lat: map.center.lat() || markers[0].lat,
                  lng: map.center.lng() || markers[0].lng,
                }
              : { lat: 0, lng: 0 }
          }
          onClick={
            markers.length !== 2 && markers.length !== 10 ? onMapClick : {}
          }
          onLoad={onMapLoad}
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
          {markers.length === 2 && (
            <Polyline
              path={[markers[0], markers[1]]}
              options={polyLineOptions}
            />
          )}
          {markers.length === 10 &&
            summaryMarkers.map((markersList) => (
              <Polyline
                key={`${markersList[0].lat}-${markersList[0].lng}`}
                path={[markersList[0], markersList[1]]}
                options={polyLineOptions}
              />
            ))}
        </GoogleMap>
        {(markers.length === 0 || markers.length % 2 !== 0) && (
          <button
            id="confirmButton"
            className={markers.length > 0 ? "active" : ""}
            onClick={() => {
              markers.length > 0 ? handleGuess() : console.log("no marker");
            }}
          >
            {markers.length > 0 ? "GUESS" : "PLACE YOUR PIN ON THE MAP"}
          </button>
        )}
        {markers.length > 0 && markers.length % 2 === 0 && (
          <div className="scoreboard">
            <div className="roundPoints">
              {markers.length !== 10 ? roundScore : gameScore} points
            </div>
            <div id="progressBar" max="100">
              <div
                id="progress"
                style={{
                  width: `${
                    markers.length !== 10
                      ? parseFloat(parseInt(roundScore) / 5000) * 100
                      : parseFloat(parseInt(gameScore) / 25000) * 100
                  }%`,
                }}
              ></div>
            </div>
            {markers.length !== 10 ? (
              <div className="score">
                Your guess was {getDistacneInUnits()} away
              </div>
            ) : (
              <div>Well played!</div>
            )}
            <button id="nextRound" onClick={() => nextRound()}>
              {summaryMarkers.length !== 5 ? "NEXT ROUND" : "SUMMARY"}
            </button>
            {summaryMarkers.length === 5 && (
              <Link to={`../../maps/${game.mapId}`}>
                <button id="playAgain" onClick={() => nextRound()}>
                  PLAY AGAIN
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    games: state.games,
    maps: state.maps,
  };
};

const mapDispatchToProps = {
  getGamesList,
  editGame,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameLogic);
