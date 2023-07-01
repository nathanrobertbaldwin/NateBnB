// ============================== IMPORTS ============================== //

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetailsThunk } from "../../store/spots";

// ============================= EXPORTS =============================== //

export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotData = useSelector((store) => store.spots);
  const spot = spotData[spotId];

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId));
  }, [dispatch, spotId]);

  return (
    <>
      <div>
        <h2>{spot.address}</h2>
      </div>
    </>
  );
}
