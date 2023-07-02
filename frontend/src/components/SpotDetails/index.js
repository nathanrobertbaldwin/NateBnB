// ============================== IMPORTS ============================== //

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetailsThunk } from "../../store/spots";
import "./SpotDetails.css";

// ============================= EXPORTS =============================== //

export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotData = useSelector((store) => store.spots);
  const spot = spotData[spotId];
  console.log("from spot details", spot);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId)).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) return <></>;

  const previewImage = spot.SpotImages.filter(
    (image) => image.preview === true
  );

  const otherImages = spot.SpotImages.filter(
    (image) => image.preview === false
  );

  // const reviews = spot.

  return (
    <div id="spot_details">
      <h2>{spot.address}</h2>
      <div id="spot_details_images_container">
        <img id="spot_details_preview_image" src={previewImage[0].url} />
        <div id="spot_details_other_images_container">
          {otherImages.map((image) => {
            return (
              <img className="spot_details_other_images" src={image.url} />
            );
          })}
        </div>
      </div>
      <div id="spot_details_info">
        <div id="spot_details_host_description">
          <h3>{`Hosted By: ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h3>
          <p id="spot_details_spot_description">{spot.description}</p>
        </div>
        <div id="spot_details_booking_card">
          <p>{`$${spot.price} / Night`}</p>
          <p>{`Rating: ${spot.avgStarRating} | Reviews: ${spot.numReviews}`}</p>
          <div id="spot_details_hosted_book_booking_card_button_container">
            <button id="spot_details_hosted_book_booking_card_button">
              Book This Spot!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
