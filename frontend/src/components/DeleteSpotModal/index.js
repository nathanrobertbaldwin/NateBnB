// frontend/src/components/DeleteSpotModal/index.js

// ============================== IMPORTS ============================== //

import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";
import { deleteASpotBySpotIdThunk } from "../../store/spots";

// ============================= EXPORTS =============================== //

export default function DeleteSpotModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();

    return dispatch(deleteASpotBySpotIdThunk(spot.id));
  };

  return (
    <>
      <h1>Confirm Delete</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Yes (Delete Spot)</button>
        <button onClick={closeModal}>No (Keep Spot)</button>
      </form>
    </>
  );
}
