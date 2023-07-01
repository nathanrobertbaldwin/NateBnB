import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import { SpotCard } from "../SpotCard";
import "./SpotsIndex.css";

export default function SpotsIndex() {
  const dispatch = useDispatch();
  const spotsData = useSelector((store) => store.spots);
  const spots = Object.values(spotsData);

  useEffect(() => {
    dispatch(getAllSpotsThunk());
  }, [dispatch]);

  return (
    <div id="home">
      {spots.map((spot) => {
        return <SpotCard key={spot.id} spot={spot} />;
      })}
    </div>
  );
}
