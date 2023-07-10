// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push("/");
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button className="button_large" onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={`${ulClassName} navigation`} ref={ulRef}>
        {user ? (
          <div id="navigation_profile_container">
            <li className="nav_links">{`Hello, ${user.firstName}!`}</li>
            <li className="nav_links">{user.username}</li>
            <li className="nav_links">{user.email}</li>
            <li className="nav_links">
              <Link to="/spots/current">Manage Spots</Link>
            </li>
            <li className="nav_links">
              <div id="nav_links_button_container">
                <button className="button_small" onClick={logout}>
                  Log Out
                </button>
              </div>
            </li>
          </div>
        ) : (
          <div id="navigation_profile_container">
            <div id="nav_links_button_container">
              <li className="nav_links">
                <OpenModalButton
                  buttonText="Log In"
                  onButtonClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
              </li>
              <li className="nav_links">
                <OpenModalButton
                  buttonText="Sign Up"
                  onButtonClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </li>
            </div>
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
