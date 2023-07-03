// ============================== IMPORTS ============================== //

import "./SpotsIndexCard.css";
import { Link } from "react-router-dom";

// ============================= EXPORTS =============================== //

export function SpotsIndexCard({ spot }) {
  const rating = spot.avgStarRating ? spot.avgStarRating : "no reviews";
  return (
    <div className="spot_card">
      <Link to={`/spots/${spot.id}`}>
        <div className="spot_preview_image">
          <img className="spot_card_image" src={spot.previewImage} />
        </div>
        <div className="">
          <div>{`${spot.city}, ${spot.state}`}</div>
          <div>{`Stars: ${rating}`}</div>
        </div>
        <div>{`$${spot.price} / night`}</div>
      </Link>
    </div>
  );
}