// frontend/src/components/DeleteSpotModal/index.js

// ============================== IMPORTS ============================== //

import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";

// ============================= EXPORTS =============================== //

function LoginFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <>
      <h1>Confirm Delete</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Yes (Delete Spot) </button>
        <button>No (Keep Spot) </button>
      </form>
    </>
  );
}

export default LoginFormModal;
