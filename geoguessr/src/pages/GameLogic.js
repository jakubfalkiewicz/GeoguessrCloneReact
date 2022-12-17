import React, { useEffect } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import { getGamesList } from "../ducks/games/actions";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  StreetViewPanorama,
} from "@react-google-maps/api";

// let location1 = "";

// function Map() {
//   const mapContainerStyle = {
//     height: "400px",
//     width: "800px",
//   };
//   return (
//     <GoogleMap
//       id="circle-example"
//       mapContainerStyle={mapContainerStyle}
//       zoom={7}
//       center={location1}
//     >
//       <StreetViewPanorama position={location1} visible={true} />
//     </GoogleMap>
//   );
// }
const google = window.google;

let panorama;
let outsideGoogle;

function initPanorama() {
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
      pano: outsideGoogle.location.pano,
      //COMPASS
      panControl: false,
      draggable: false,
      //ZOOM BUTTONS
      zoomControl: false,
      //ROAD ARROWS
      linksControl: false,
      //ZOOM
      scrollwheel: true,
      //MOVING
      clickToGo: false,
      //SHOW ADDRESS
      addressControl: false,
      //ROAD NAMES
      showRoadLabels: false,
      //ADDONS
      fullscreenControl: false,
      motionTrackingControl: true,
      enableCloseButton: false,
      visible: true,
    }
  );
}

function initMap() {
  new google.maps.StreetViewService()
    .getPanorama({ location: { lat: -33.867386, lng: 151.195767 } })
    .then(({ data }) => {
      outsideGoogle = data;
      initPanorama();
    });
}
window.initMap = initMap;

const GameLogic = ({ games, getGamesList }) => {
  useEffect(() => {
    if (games.length === 0) {
      getGamesList();
    }
  });
  const { id } = useParams();
  const game = games.filter((game) => game.id === id)[0];
  // location1 = game.locations[0];
  // delete location1._id;
  // console.log(location1);
  // console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  // });

  return (
    <div>
      <div>GameLogic</div>
      {/* <Map /> */}
      {/* {game && (
        <div>
          <div>Move: {game.move.toString()}</div>
          <div>Pan: {game.pan}</div>
          <div>Zoom: {game.zoom}</div>
        </div>
      )} */}
      <div id="street-view"></div>
      {/* <script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDvKdFAG_9BvdC0JiBR8EScp1qqxq26i6Q&v=weekly&libraries=geometry"
        defer
      ></script> */}
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
