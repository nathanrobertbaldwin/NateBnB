// frontend/src/store/spots.js

// ============================== IMPORTS ============================== //

import { csrfFetch } from "./csrf";

// ========================== ACTION STRINGS =========================== //

// Get All Spots

const GET_ALL_SPOTS = "spots/getAllSpots";

// Get Spot Details

const GET_SPOT_DETAILS = "spots/getSpotDetails";

// Create New Spot

const POST_NEW_SPOT = "spots/postNewSpot";

// Get Spots By OwnerId

const GET_SPOTS_BY_OWNERID = "spots/getSpotsByOwnerId";

// Edit A Spot By SpotId

const EDIT_A_SPOT_BY_SPOTID = "spots/editASpotBySpotId";

// Delete A Spot By SpotId

const DELETE_A_SPOT_BY_SPOTID = "spots/deleteASpotBySpotId";

// Post A Review By SpotId;

const POST_A_REVIEW_BY_SPOT_ID = "spots/postAReviewBySpotId";

// Delete A Spot Review by ReviewId

const DELETE_A_SPOT_REVIEW_BY_REVIEWID = "spots/deleteASpotReviewByReviewId";

// ============================== ACTIONS ============================== //

// Get All Spots

const getAllSpots = (data) => {
  return {
    type: GET_ALL_SPOTS,
    payload: data,
  };
};

// Get Spot Details

const getSpotDetails = (data) => {
  return {
    type: GET_SPOT_DETAILS,
    payload: data,
  };
};

// Post New Spot

const postNewSpot = (data) => {
  return {
    type: POST_NEW_SPOT,
    payload: data,
  };
};

// Get Spots By OwnerId

const getSpotsByOwnerId = (data) => {
  return {
    type: GET_SPOTS_BY_OWNERID,
    payload: data,
  };
};

// Edit A Spot By SpotId

const editASpotBySpotId = (data) => {
  return {
    type: EDIT_A_SPOT_BY_SPOTID,
    payload: data,
  };
};

// Delete A Spot By SpotId

const deleteASpotBySpotId = (data) => {
  return {
    type: DELETE_A_SPOT_BY_SPOTID,
    payload: data,
  };
};

// Post A Review By SpotId

const postAReviewBySpotId = (data) => {
  return {
    type: POST_A_REVIEW_BY_SPOT_ID,
    payload: data,
  };
};

// Delete A Review By ReviewId

const deleteASpotReviewByReviewId = (data) => {
  return {
    type: DELETE_A_SPOT_REVIEW_BY_REVIEWID,
    payload: data,
  };
};

// ============================== THUNKS =============================== //

// Get All Spots

export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const data = await response.json();
    dispatch(getAllSpots(data));
    return data;
  }
};

// Get Spot Details

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getSpotDetails(data));
    return data;
  }
};

// Post New Spot

export const postNewSpotThunk = (data) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(postNewSpot(data));
    return data;
  }
};

// Get All Spots By OwnerId

export const getAllSpotsByOwnerIdThunk = () => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/current`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getSpotsByOwnerId(data));
    return data;
  }
};

// Edit A Spot By SpotId

export const editASpotBySpotIdThunk = (data) => async (dispatch) => {
  const spotId = data.spotId;
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(editASpotBySpotId(data));
    return data;
  }
};

// Delete A Spot By SpotId

export const deleteASpotBySpotIdThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteASpotBySpotId(spotId));
    return data;
  }
};

// Post A Review By Spot Id Thunk

export const postAReviewBySpotIdThunk = (data) => async (dispatch) => {
  const spotId = data.spotId;
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(postAReviewBySpotId(data));
    return data;
  }
};

// Delete A Spot Review By ReviewId Thunk

export const deleteASpotReviewByReviewIdThunk =
  (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(deleteASpotReviewByReviewId(data));
      return data;
    }
  };

// ============================== HELPERS ============================== //

function normalizeData(arr) {
  const normalizedData = {};
  arr.forEach((item) => {
    normalizedData[item.id] = item;
  });
  return normalizedData;
}

// =========================== SPOTS REDUCER =========================== //

export const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_SPOTS: {
      const data = normalizeData(action.payload.Spots);
      const newState = { ...data };
      return newState;
    }
    case GET_SPOT_DETAILS: {
      const data = action.payload;
      const newState = { ...data };
      newState.Reviews = normalizeData(newState.Reviews);
      return newState;
    }
    case POST_NEW_SPOT: {
      const data = action.payload;
      const newState = { ...state, ...data };
      return newState;
    }
    case GET_SPOTS_BY_OWNERID: {
      const data = normalizeData(action.payload.Spots);
      const newState = { ...data };
      return newState;
    }
    case EDIT_A_SPOT_BY_SPOTID: {
      const data = action.payload;
      const newState = { ...data };
      return newState;
    }
    case DELETE_A_SPOT_BY_SPOTID: {
      const id = action.payload;
      const newState = { ...state };
      delete newState[id];
      return newState;
    }
    case POST_A_REVIEW_BY_SPOT_ID: {
      const data = action.payload;
      const newState = { ...data };
      return newState;
    }
    case DELETE_A_SPOT_REVIEW_BY_REVIEWID: {
      const data = action.payload;
      const newState = { ...data };
      return newState;
    }
    default:
      return state;
  }
};
