// frontend/src/components/PostReviewModal/index.js

// ============================== IMPORTS ============================== //

import React, { useState, useEffect } from "react";
import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { postAReviewBySpotIdThunk } from "../../../store/spots";
import { FaStar } from "react-icons/fa";
import "./PostReviewModal.css";

// ============================= EXPORTS =============================== //

export default function PostReviewModal({ spot }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const [reviewText, setReviewText] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [serverErrors, setServerErrors] = useState("");
  const [clickedStars, setClickedStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(undefined);

  // Error Checking

  useEffect(() => {
    _checkForErrors();
  }, [reviewText]);

  // Submit Handler

  async function handleSubmit(e) {
    e.preventDefault();

    if (Object.values(validationErrors).length === 0) {
      const data = {
        spotId: spot.id,
        stars: clickedStars,
        review: reviewText,
      };

      try {
        await dispatch(postAReviewBySpotIdThunk(data));
      } catch (err) {
        err = await err.json();
        setServerErrors(err.message);
        return;
      }

      closeModal();
      _reset();
      history.push(`/spots/${spot.id}`);
    }
  }

  function handleMouseOver(index) {
    setHoverStars(index);
  }

  function handleMouseLeave() {
    setHoverStars(undefined);
  }

  function handleClick(index) {
    setClickedStars(index);
  }

  // Helper Functions

  function _checkForErrors() {
    const errors = {};
    if (reviewText.length < 10)
      errors.reviewText = "Review must be longer than 10 characters.";
    setValidationErrors(errors);
  }

  function _reset() {
    setReviewText("");
    setClickedStars(0);
    setValidationErrors({});
  }

  const starArray = new Array(5).fill(0);

  return (
    <div id="review_form_modal_container">
      <h1>How was your stay?</h1>
      <form id="review_form" onSubmit={handleSubmit}>
        {serverErrors && <p>{serverErrors}</p>}
        <div id="review_stars_container">
          {starArray.map((_, index) => {
            return (
              <FaStar
                className={
                  clickedStars > index || hoverStars > index
                    ? "review_stars_light"
                    : "review_stars_dark"
                }
                key={index}
                onMouseOver={() => handleMouseOver(index + 1)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(index + 1)}
              />
            );
          })}
        </div>
        <textarea
          id="review_text"
          rows="10"
          placeholder="Just a quick review."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        ></textarea>
        <div id="review_button_container">
          <button
            type="submit"
            className="button_small"
            disabled={Object.values(validationErrors).length > 0}
          >
            Submit Your Review
          </button>
        </div>
      </form>
    </div>
  );
}
