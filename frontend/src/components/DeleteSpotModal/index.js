// frontend/src/components/DeleteSpotModal/index.js

// ============================== IMPORTS ============================== //

import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteASpotBySpotIdThunk } from "../../store/spots";
import "./DeleteSpotModal.css";

// ============================= EXPORTS =============================== //

export default function DeleteSpotModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleConfirmation = (e) => {
    e.preventDefault();
    dispatch(deleteASpotBySpotIdThunk(spot.id));
    closeModal();
    history.push("/spots/current");
  };

  const handleDenial = (e) => {
    e.preventDefault();
    closeModal();
    history.push("/spots/current");
  };
  return (
    <>
      <h1>Confirm Delete</h1>
      <form onSubmit={handleConfirmation}>
        <button type="submit">Yes (Delete Spot)</button>
        <button onClick={handleDenial}>No (Keep Spot)</button>
      </form>
    </>
  );
}
