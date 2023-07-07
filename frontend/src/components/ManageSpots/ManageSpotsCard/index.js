// ============================== IMPORTS ============================== //

import { Link } from "react-router-dom";
import OpenModalButton from "../../OpenModalButton";
import DeleteSpotModal from "../../DeleteSpotModal";
import { FaStar } from "react-icons/fa";
import "./ManageSpotsCard.css";

// ============================= EXPORTS =============================== //

export function ManageSpotsCard({ spot }) {
  return (
    <div id="spot_card_container">
      <Link to={`/spots/${spot.id}`}>
        <div id="spot_preview_image_container">
          <img alt="" id="spot_card_preview_image" src={spot.previewImage} />
        </div>
        <div id="city_state_stars">
          <h3>{`${spot.city}, ${spot.state}`}</h3>{" "}
          <h3>
            <FaStar id="review_stars" />
            {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New!"}
          </h3>
        </div>
        <p>{`$${spot.price} per night`}</p>
      </Link>
      <div id="spots_card_button_container">
        <Link to={`/spots/${spot.id}/edit`}>
          <button className="button_small">Update</button>
        </Link>
        <OpenModalButton
          buttonText="Delete"
          modalComponent={<DeleteSpotModal spot={spot} />}
        />
      </div>
    </div>
  );
}
