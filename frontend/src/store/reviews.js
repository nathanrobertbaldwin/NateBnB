// ============================== IMPORTS ============================== //

import { csrfFetch } from "./csrf";

// ========================== ACTION STRINGS =========================== //

// Delete A Review By ReviewId

const DELETE_A_REVIEW_BY_REVIEWID = "review/deleteAReviewByReviewId";

// ============================== ACTIONS ============================== //

// Delete A Review By ReviewId

const deleteAReviewByReviewId = (data) => {
  return {
    type: DELETE_A_REVIEW_BY_REVIEWID,
    payload: data,
  };
};

// ============================== THUNKS =============================== //

// Delete A Review By ReviewId Thunk

export const deleteAReviewByReviewIdThunk = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteAReviewByReviewId(reviewId));
    return data;
  }
};

// =========================== REVIEW REDUCER =========================== //

export const ReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_A_REVIEW_BY_REVIEWID: {
      console.log("hitting this");
      const id = action.payload;
      const newState = { ...state };
      delete newState.spots.Reviews[id];
      return newState;
    }
    default:
      return state;
  }
};
