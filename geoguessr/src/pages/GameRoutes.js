import React from "react";
import { Routes, Route } from "react-router-dom";
// import MapsList from "./MapsList";

import NotFound from "./NotFound";
import GameLogic from "./GameLogic";
import GameSummary from "./GameSummary";

export default function MapRoutes() {
  return (
    <div>
      <Routes>
        {/* <Route index element={<MapsList />} /> */}
        <Route path=":id" element={<GameLogic />} />
        <Route path="summary" element={<GameSummary />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
}
