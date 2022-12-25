import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getGamesList } from "../ducks/games/actions";
import { GoogleMap, StreetViewPanorama, Marker } from "@react-google-maps/api";

const GameLogic = ({ games }) => {
  const [round, setRound] = useState(0);
  const { id } = useParams();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState(null);

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

  const addSolMarker = () => {
    const scaledIcon = {
      url: "https://www.geoguessr.com/_next/static/images/correct-location-4da7df904fc6b08ce841e4ce63cd8bfb.png",
      scaledSize: new window.google.maps.Size(25, 25),
    };
    const markerSol = new window.google.maps.Marker({
      location,
      map,
      icon: scaledIcon,
      url: `https://www.google.com/maps?q&layer=c&cbll=${location.lat},${location.lng}`,
    });
    console.log(markerSol);
    setMarkers((current) => [
      ...current,
      {
        lat: location.lat,
        lng: location.lng,
        icon: scaledIcon,
        url: `https://www.google.com/maps?q&layer=c&cbll=${location.lat},${location.lng}`,
      },
    ]);
  };

  const evaluateGuess = () => {
    const solPos = new window.google.maps.LatLng(location.lat, location.lng);
    const markerPos = new window.google.maps.LatLng(
      markers[0].lat,
      markers[0].lng
    );

    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        solPos,
        markerPos
      );
    console.log(distance);
    addSolMarker();
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
      <div id="map-container">
        <GoogleMap
          id="map"
          mapContainerStyle={{
            height: "210px",
            width: "250px",
          }}
          zoom={3}
          center={
            markers.length > 0
              ? {
                  lat: markers[0].lat,
                  lng: markers[0].lng,
                }
              : { lat: 0, lng: 0 }
          }
          onClick={onMapClick}
          onLoad={onLoad}
        >
          {markers.length > 0 &&
            markers.map((marker) => (
              <Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: marker.url
                    ? `https://www.geoguessr.com/_next/static/images/correct-location-4da7df904fc6b08ce841e4ce63cd8bfb.png`
                    : `https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png`,
                  scaledSize: marker.url
                    ? new window.google.maps.Size(25, 25)
                    : new window.google.maps.Size(22, 40),
                }}
              />
            ))}
        </GoogleMap>
        <button
          id="confirmButton"
          onClick={() => {
            markers.length > 0 ? evaluateGuess() : console.log("no marker");
          }}
        >
          {markers.length > 0 ? "GUESS" : "PLACE YOUR PIN ON THE MAP"}
        </button>
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
