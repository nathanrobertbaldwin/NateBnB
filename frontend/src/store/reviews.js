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
      const id = action.payload;
      const newState = { ...state };
      delete newState[id]; // remember to change this based on state shape.
      return newState;
    }
    default:
      return state;
  }
};
