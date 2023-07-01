// ============================== IMPORTS ============================== //

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import { SpotCard } from "../SpotCard";
import "./SpotsIndex.css";

// ============================= EXPORTS =============================== //

export default function SpotsIndex() {
  const dispatch = useDispatch();
  const spotsData = useSelector((store) => store.spots);
  const spots = Object.values(spotsData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getAllSpotsThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) return <></>;

  return (
    <div id="spots_index">
      {spots.map((spot) => {
        return <SpotCard key={spot.id} spot={spot} />;
      })}
    </div>
  );
}
