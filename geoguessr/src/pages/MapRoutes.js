import React from "react";
import { Routes, Route } from "react-router-dom";
import MapsList from "./MapsList";
import MapDetails from "./MapDetails";
import NewMap from "./NewMap";
import NotFound from "./NotFound";
import Map from "./Map";
import { LoadScript } from "@react-google-maps/api";

export default function MapRoutes() {
  const lib = ["places"];
  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return (
    <div>
      <Routes>
        <Route index element={<MapsList />} />
        <Route path=":id" element={<MapDetails />} />
        <Route path="new" element={<NewMap />} />
        <Route
          path="test"
          element={
            <LoadScript googleMapsApiKey={key} libraries={lib}>
              <Map />
            </LoadScript>
          }
        />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}
