// ============================== IMPORTS ============================== //

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotDetailsThunk } from "../../store/spots";

import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import PostReviewModal from "./PostReviewModal";
import Reviews from "../Reviews";
import MapContainer from "../Maps";
import { FaStar } from "react-icons/fa";
import "./SpotDetails.css";

// ============================= EXPORTS =============================== //

export default function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.session);
  const sessionData = useSelector((state) => state.session);
  const spot = useSelector((store) => store.spots);
  const reviewsData = useSelector((state) => state.spots.Reviews);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  const handleAlert = (e) => {
    window.alert("Feature Coming Soon!");
  };

  if (!isLoaded) return <></>;

  const reviews = Object.values(reviewsData);

  const reviewsCount = reviews.length;

  const avgStarRating = spot.avgStarRating
    ? spot.avgStarRating.toFixed(2)
    : "New!";

  const previewImage = spot.SpotImages.filter(
    (image) => image.preview === true
  );

  const otherImages = spot.SpotImages.filter(
    (image) => image.preview === false
  );

  let loginButton;
  let postYourReview;

  if (!sessionData.user) {
    loginButton = (
      <OpenModalButton
        className="orange_modal_button"
        buttonText="Login to Post Review"
        modalComponent={<LoginFormModal />}
      />
    );
  } else {
    let userCanPostReview =
      sessionData.user.id !== spot.ownerId &&
      reviews.every((review) => userData.user.id !== review.userId);
    if (userCanPostReview) {
      postYourReview = (
        <OpenModalButton
          className="orange_modal_button"
          buttonText="Post Your Review"
          modalComponent={<PostReviewModal spot={spot} />}
        />
      );
    } else postYourReview = "";
  }

  return (
    <div id="spot_details">
      <h2>
        {spot.address}, {spot.state}, {spot.country}
      </h2>
      <div id="spot_details_images_container">
        <img
          alt="spot"
          id="spot_details_preview_image"
          src={previewImage[0].url}
        />
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
                  <div id="spot_details_booking_card_review_info">
                    <FaStar id="review_stars" />
                    <p id="reviews_stars_container">
                      {`${avgStarRating} `}
                      {reviewsCount === 0
                        ? ""
                        : reviewsCount === 1
                        ? ` ${reviewsCount} Review`
                        : ` ${reviewsCount} Reviews`}
                    </p>
                  </div>
                )}
              </h5>
            </div>
            {sessionData.user ? (
              <div id="spot_details_booking_button_container">
                <button className="button_small" onClick={handleAlert}>
                  Book This Spot!
                </button>
              </div>
            ) : (
              <OpenModalButton
                className="orange_modal_button"
                buttonText="Login to Create Booking"
                modalComponent={<LoginFormModal />}
              />
            )}
          </div>
        </div>
      </div>
      <div id="reviews_title_post_review_container">
        <div id="review_title">
          {reviewsCount === 0 ? (
            <h3>New!</h3>
          ) : (
            <h3>
              <FaStar id="review_stars" />
              {` ${avgStarRating} `}
              <span>&#183;</span>
              {reviewsCount === 1
                ? ` ${reviewsCount} Review`
                : ` ${reviewsCount} Reviews`}
            </h3>
          )}
        </div>
        {postYourReview}
        {loginButton}
      </div>
      <div id="reviews_container">
        {reviewsCount === 0 ? (
          <div>
            <p></p>
            <h4>Be the first to review this spot!</h4>
          </div>
        ) : (
          <Reviews spot={spot} />
        )}
      </div>
      <MapContainer />
    </div>
  );
}
