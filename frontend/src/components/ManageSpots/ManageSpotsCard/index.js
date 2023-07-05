// ============================== IMPORTS ============================== //

import { Link } from "react-router-dom";
import "./ManageSpotsCard.css";

// ============================= EXPORTS =============================== //

export function ManageSpotsCard({ spot }) {
  const rating = spot.avgStarRating ? spot.avgStarRating : "no reviews";
  return (
    <div className="spot_card">
      <Link to={`/spots/${spot.id}`}>
        <div className="spot_preview_image">
          <img alt="" className="spot_card_image" src={spot.previewImage} />
        </div>
        <div className="">
          <div>{`${spot.city}, ${spot.state}`}</div>
          <div>{`Stars: ${rating}`}</div>
        </div>
        <div>{`$${spot.price} / night`}</div>
      </Link>
      <div id="spots_card_button_container">
        <Link to={`/spots/${spot.id}/edit`}>
          <button className="sports_card_buttons">Update</button>
        </Link>
        <Link to="/spots/${spot.id}/}">
          <button className="sports_card_buttons">Delete</button>
        </Link>
      </div>
    </div>
  );
}
