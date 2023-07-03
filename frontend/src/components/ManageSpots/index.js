// ============================== IMPORTS ============================== //

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsByOwnerIdThunk } from "../../store/spots";
import { ManageSpotsCard } from "./ManageSpotsCard";
import "./ManageSpots.css";

// ============================= EXPORTS =============================== //

export function ManageSpots() {
  const dispatch = useDispatch();
  const spotsData = useSelector((store) => store.spots);
  const spots = Object.values(spotsData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSpotsByOwnerIdThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) return <></>;

  return (
    <div id="manage_spots">
      {spots.map((spot) => {
        return <ManageSpotsCard key={spot.id} spot={spot} />;
      })}
    </div>
  );
}
