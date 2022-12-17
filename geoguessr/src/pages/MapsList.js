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
  console.log(maps);
  return (
    <div>
      <h1>MapsList</h1>
      <div className="gameslist-games">
        {maps.length !== 0 ? (
          maps.map((el) => (
            <Link key={el._id} to={el._id}>
              <div className="gameslist-game" id={el._id}>
                <div>{el.name}</div>
                <div>{el.description}</div>
                <div>{el.likes} likes</div>
                <div>{el.locationsList.length} locations</div>
              </div>
            </Link>
          ))
        ) : (
          <div>MAPS LOADING...</div>
        )}
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
