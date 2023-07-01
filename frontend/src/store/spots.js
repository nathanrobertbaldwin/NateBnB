// frontend/src/store/spots.js

// ============================== IMPORTS ============================== //

import { csrfFetch } from "./csrf";

// ========================== ACTION STRINGS =========================== //

// Get All Spots

const GET_ALL_SPOTS = "spots/getAllSpots";

// Get Spot Details

const GET_SPOT_DETAILS = "spots/getSpotDetails";

// ============================== ACTIONS ============================== //

// Get All Spots

const getAllSpots = (data) => {
  return {
    type: GET_ALL_SPOTS,
    payload: data,
  };
};

const getSpotDetails = (data) => {
  return {
    type: GET_SPOT_DETAILS,
    payload: data,
  };
};

// ============================== THUNKS =============================== //

// Get All Spots

export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("api/spots");
  if (response.ok) {
    const data = await response.json();
    dispatch(getAllSpots(data));
    return data;
  }
};

// Get Spot Images

export const getSpotDetailsThunk = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`api/spots/${spotId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getSpotDetails(data));
    return data;
  }
};

// ============================== HELPERS ============================== //

function normalizeSpots(arr) {
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
      const data = normalizeSpots(action.payload.Spots);
      const newState = { ...state, ...data };
      return newState;
    }
    case GET_SPOT_DETAILS: {
      const data = action.payload.Spot;
      const newState = { ...state };
      newState.id = data;
      return newState;
    }
    default:
      return state;
  }
};

// ============================= EXPORTS =============================== //
