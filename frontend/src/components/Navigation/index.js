// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

export default function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div id="nav_container">
      <div id="logo_container">
        <img id="logo" />
      </div>
      <ul className="navigation">
        {sessionUser && (
          <Link to="/spots/new">
            <button class="button_small">Create A New Spot</button>
          </Link>
        )}
        <li className="nav_links">
          <NavLink exact to="/">
            <button className="button_large">Home</button>
          </NavLink>
        </li>
        {isLoaded && (
          <li className="nav_links">
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}
