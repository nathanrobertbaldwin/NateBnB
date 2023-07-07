// ============================== IMPORTS ============================== //

import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./SpotsIndexCard.css";

// ============================= EXPORTS =============================== //

export function SpotsIndexCard({ spot }) {
  return (
    <Link className="spot_card_container" to={`/spots/${spot.id}`}>
      <div className="spot_card_image_container">
        <img
          className="spot_card_image"
          src={spot.previewImage}
          title={spot.name}
        />
      </div>
      <div className="city_state_stars">
        <h3>{`${spot.city}, ${spot.state}`}</h3>{" "}
        <h3>
          <FaStar className="review_stars" />
          {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New!"}
        </h3>
      </div>
      <p>{`$${spot.price} per night`}</p>
    </Link>
  );
}
