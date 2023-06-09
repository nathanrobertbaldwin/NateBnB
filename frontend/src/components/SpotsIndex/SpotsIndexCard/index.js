// ============================== IMPORTS ============================== //

import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./SpotsIndexCard.css";

// ============================= EXPORTS =============================== //

export function SpotsIndexCard({ spot }) {
  return (
    <Link id="spot_card_container" to={`/spots/${spot.id}`}>
      <div id="spot_card_image_container">
        <img
          alt="spot"
          id="spot_card_image"
          src={spot.previewImage}
          title={spot.name}
        />
      </div>
      <div id="city_state_stars">
        <h4>{`${spot.city}, ${spot.state}`}</h4>{" "}
        <h4>
          <FaStar id="review_stars" />
          {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New!"}
        </h4>
      </div>
      <p>{`$${spot.price} per night`}</p>
    </Link>
  );
}
