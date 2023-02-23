import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-main-view">
        <div className="home-upgrade-bar">
          <div></div>
          <div className="free-acc-info">
            You are on a Free-account and can play for free for 5 minutes every
            15 minutes.
          </div>
          <div className="timer-upgrade">
            <div className="timer-container">
              <div className="timer">
                <picture>
                  <source
                    srcset="https://www.geoguessr.com/_next/static/images/stopwatch-green-117bf5891a9fb89afb33d1ab0c1c5a92.avif"
                    type="image/avif"
                  />
                  <source
                    srcset="https://www.geoguessr.com/_next/static/images/stopwatch-green-16e5910a5a8768e747aa37723a0f21c3.webp"
                    type="image/webp"
                  />
                  <img
                    class="ticket-bar_stopwatchImage__5axy6"
                    src="https://www.geoguessr.com/_next/static/images/stopwatch-green-2e27320085422df7d2496ec56fd80fc6.png"
                    aria-hidden="true"
                    alt=""
                    width="20"
                    height="20"
                  />
                </picture>
                <div class="countdown-time">
                  <span>05</span>
                  <span>:</span>
                  <span>00</span>
                </div>
              </div>
            </div>
            <div className="upgrade">
              <span class="upgrade-text">UPGRADE TO PRO</span>
            </div>
          </div>
        </div>
        <div className="home-nav-bar"></div>
        <div className="home-main">
          <Link
            to="/maps"
            className="link"
            style={{ textDecoration: "none", color: "white" }}
          >
            Maps
          </Link>
        </div>
      </div>
      <div className="home-side-bar">
        <div className="sidie-bar-content"></div>
      </div>
    </div>
  );
}
