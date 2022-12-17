import React from "react";
import { useParams } from "react-router";

function GameLogic(props) {
  const { id } = useParams();
  console.log(id);
  return <div>GameLogic</div>;
}

export default GameLogic;
