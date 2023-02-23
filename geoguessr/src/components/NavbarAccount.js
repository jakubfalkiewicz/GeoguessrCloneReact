import React from "react";
import profileAvatar from "../media/profile-avatar.webp";
import tier50 from "../media/tier-50.png";
import "../styles/NavbarAccount.css";

export default function NavbarAccount() {
  return (
    <div className="account-info">
      <div className="search-bar">
        <div className="skew-background-1"></div>
        <picture>
          <img
            src="https://www.geoguessr.com/_next/static/images/search-icon-6aee7cacff9ad0bd5e6b637943a0180a.svg"
            alt=""
          />
        </picture>
        <div className="skew-background-2"></div>
      </div>
      <div className="account">
        <div className="profile-avatar">
          <div>
            <img src={profileAvatar} loading="auto" alt="profile-avatar" />
          </div>
          <picture>
            <img src={tier50} alt="tier-50" />
          </picture>
        </div>
        <div className="profile-stats">
          <div className="user-level">LVL 46</div>
          <div className="user-title">VOYAGER</div>
          <div className="user-level-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
