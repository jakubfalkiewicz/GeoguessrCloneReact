import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getMapsList } from "../ducks/maps/actions";
import UpgradeBar from "../components/UpgradeBar";
import NavbarAccount from "../components/NavbarAccount";
import poland from "../media/poland-map.jpg";
import pomerania from "../media/pomerania-map.jpg";
import "../styles/MapsList.css";

const MapsList = ({ getMapsList, maps }) => {
  useEffect(() => {
    if (maps.length === 0) {
      getMapsList();
    }
  });
  console.log(maps);
  return (
    <div className="maps-container">
      <div className="maps-main-view">
        <UpgradeBar />
        <div className="maps-nav-bar">
          <header>
            <div className="logo">
              <a title="GeoGuessr" href="/">
                <img
                  src="https://www.geoguessr.com/_next/static/images/logo-e108dab37292e7fec6148eb5f19bf484.svg"
                  alt="GeoGuessr"
                />
              </a>
            </div>
            <div></div>
            <NavbarAccount />
          </header>
        </div>
        <div className="maps-main">
          <div className="maps-grid">
            {maps.length !== 0 ? (
              maps.map((el) => (
                <Link
                  key={el._id}
                  to={el._id}
                  style={{ textDecoration: "none", cursor: "auto" }}
                >
                  <div className="map" id={el._id}>
                    <img
                      src={el.name === "Tricity areas" ? pomerania : poland}
                    ></img>
                    <div>{el.name}</div>
                    <button>PLAY</button>
                    {/* <div>{el.description}</div> */}
                    {/* <div>{el.likes} likes</div> */}
                    {/* <div>{el.locationsList.length} locations</div> */}
                  </div>
                </Link>
              ))
            ) : (
              <div>MAPS LOADING...</div>
            )}
          </div>
        </div>
        <div className="home-side-bar">
          <div className="sidie-bar-content"></div>
        </div>
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
