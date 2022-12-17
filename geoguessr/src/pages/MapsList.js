import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getMapsList } from "../ducks/maps/actions";

const MapsList = ({ getMapsList, maps }) => {
  useEffect(() => {
    if (maps.length === 0) {
      getMapsList();
    }
  });
  return (
    <div>
      <h1>MapsList</h1>
      <div className="gameslist-games">
        {maps.map((el) => (
          <Link key={el._id} to={el._id}>
            <div className="gameslist-game" id={el._id}>
              <div>{el.name}</div>
              <div>{el.description}</div>
              <div>{el.likes} likes</div>
              <div>{el.locationsList.length} locations</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    maps: state.maps,
  };
};

const mapDispatchToProps = {
  getMapsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapsList);
