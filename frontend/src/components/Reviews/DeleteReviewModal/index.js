// frontend/src/components/DeleteSpotModal/index.js

// ============================== IMPORTS ============================== //

import React from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteASpotReviewByReviewIdThunk } from "../../../store/spots";
import "./DeleteReviewModal.css";

// ============================= EXPORTS =============================== //

export default function DeleteAReviewModal({ review }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleConfirmation = (e) => {
    dispatch(deleteASpotReviewByReviewIdThunk(review.id));
    closeModal();
    history.push(`/spots/${review.spotId}`);
  };

  const handleDenial = (e) => {
    e.preventDefault();
    closeModal();
    history.push(`/spots/${review.spotId}`);
  };

  return (
    <>
      <h1>Confirm Delete</h1>
      <form onSubmit={handleConfirmation}>
        <button type="button" value={review.id} onClick={handleConfirmation}>
          Yes (Delete Review)
        </button>
        <button type="button" onClick={handleDenial}>
          No (Keep Review)
        </button>
      </form>
    </>
  );
}
