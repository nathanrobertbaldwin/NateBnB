// ============================== IMPORTS ============================== //

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getSpotDetailsThunk } from "../../store/spots";

import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import PostReviewModal from "./PostReviewModal";
import Reviews from "../Reviews";
import { FaStar } from "react-icons/fa";
import "./SpotDetails.css";

// ============================= EXPORTS =============================== //

export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const sessionData = useSelector((state) => state.session);
  console.log(sessionData);
  const spot = useSelector((store) => store.spots);
  const reviewsData = useSelector((state) => state.spots.Reviews);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  if (!isLoaded) return <></>;

  const reviewsCount = Object.values(reviewsData).length;

  const previewImage = spot.SpotImages.filter(
    (image) => image.preview === true
  );

  const otherImages = spot.SpotImages.filter(
    (image) => image.preview === false
  );

  const avgStarRating = spot.avgStarRating.toFixed(2);

  return (
    <div id="spot_details">
      <h2>{spot.address}</h2>
      <div id="spot_details_images_container">
        <img alt="" id="spot_details_preview_image" src={previewImage[0].url} />
        <div id="spot_details_other_images_container">
          {otherImages.map((image) => {
            return (
              <img
                alt=""
                key={image.id}
                className="spot_details_other_images"
                src={image.url}
              />
            );
          })}
        </div>
      </div>
      <div id="spot_details_info_container">
        <h3>{`Hosted By: ${spot.Owner.firstName} ${spot.Owner.lastName}`}</h3>
        <div id="spot_details_description_booking_button_container">
          <p id="spot_details_spot_description">{spot.description}</p>
          <div id="spot_details_booking_card">
            <div id="spot_details_booking_card_header_container">
              <h4>{`$${spot.price} / night `}</h4>
              <h5>
                {spot.Reviews.length === 0 ? (
                  "New!"
                ) : (
                  <p id="reviews_stars_container">
                    <FaStar id="review_stars" />
                    {` ${avgStarRating} | ${reviewsCount} Reviews`}
                  </p>
                )}
              </h5>
            </div>
            {sessionData.user ? (
              <div id="spot_details_booking_button_container">
                <button className="button_small">Book This Spot!</button>
              </div>
            ) : (
              <OpenModalButton
                buttonText="Login to Create Booking"
                modalComponent={<LoginFormModal />}
              />
            )}
          </div>
        </div>
      </div>
      <div id="reviews_title_post_review_container">
        <h3 id="review_title">
          {reviewsCount === 0 ? (
            "New!"
          ) : (
            <h3>
              <FaStar id="review_stars" />
              {` ${avgStarRating} | ${reviewsCount} Reviews`}
            </h3>
          )}
        </h3>
        {sessionData.user ? (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<PostReviewModal spot={spot} />}
          />
        ) : (
          <OpenModalButton
            buttonText="Login to Post Review"
            modalComponent={<LoginFormModal />}
          />
        )}
      </div>
      <div id="reviews_container">
        <Reviews spot={spot} />
      </div>
    </div>
  );
}
