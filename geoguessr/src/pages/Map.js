// import { useMemo } from "react";
// import {
//   GoogleMap,
//   useLoadScript,
//   Marker,
//   LoadScript,
//   StreetViewPanorama,
// } from "@react-google-maps/api";
// // import ScriptLoaded from "@react-google-maps/api/src/docs/ScriptLoaded";

// function Home() {
//   console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//   });

//   if (!isLoaded) return <div>Loading...</div>;
//   return (
//     <div>
//       <Map />
//     </div>
//   );
// }

// function Map() {
//   const mapContainerStyle = {
//     height: "400px",
//     width: "800px",
//   };

//   const center = {
//     lat: 54.364442,
//     lng: 18.643173,
//   };

//   return (
//     <GoogleMap
//       id="circle-example"
//       mapContainerStyle={mapContainerStyle}
//       zoom={7}
//       center={center}
//     >
//       <StreetViewPanorama position={center} visible={true} />
//     </GoogleMap>
//   );
// }

// export default Home;

import React from "react";
import {
  GoogleMap,
  LoadScript,
  StreetViewPanorama,
} from "@react-google-maps/api";

function Map() {
  const containerStyle = {
    height: "400px",
    width: "800px",
  };

  const center = {
    lat: 54.364442,
    lng: 18.643173,
  };
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <StreetViewPanorama
          id="street-view"
          mapContainerStyle={containerStyle}
          position={center}
          visible={true}
        />
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);
