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
    <div id="delete_review_modal_container">
      <h1 id="delete_review_modal_form_h1">Confirm Delete</h1>
      <di id="delete_review_modal_button_container">
        <button
          type="button"
          className="button_small"
          value={review.id}
          onClick={handleConfirmation}
        >
          Yes (Delete Review)
        </button>
        <button type="button" className="button_small" onClick={handleDenial}>
          No (Keep Review)
        </button>
      </di>
    </div>
  );
}
