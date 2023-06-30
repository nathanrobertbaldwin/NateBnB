// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div id="nav_container">
      <div id="logo_container">
        <img id="logo" />
      </div>
      <ul id="navigation">
        <li class="nav_links">
          <NavLink exact to="/">
            <button class="nav_button">Home</button>
          </NavLink>
        </li>
        {isLoaded && (
          <li class="nav_links">
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
