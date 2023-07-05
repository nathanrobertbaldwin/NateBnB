// ============================== IMPORTS ============================== //

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllSpotsByOwnerIdThunk } from "../../store/spots";
import { ManageSpotsCard } from "./ManageSpotsCard";
import "./ManageSpots.css";

// ============================= EXPORTS =============================== //

export default function ManageSpots() {
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
      <div id="manage_spots_header">
        <h1>Manage Spots</h1>
        <Link to="/spots/new">
          <button>Create a new Spot</button>
        </Link>
      </div>
      {spots.map((spot) => {
        return <ManageSpotsCard key={spot.id} spot={spot} />;
      })}
    </div>
  );
}
