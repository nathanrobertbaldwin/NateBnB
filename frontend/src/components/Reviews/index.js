import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteAReviewModal from "./DeleteReviewModal";
import "./Reviews.css";

export default function Reviews() {
  const spot = useSelector((state) => state.spots);
  const sessionData = useSelector((state) => state.session);
  const reviewsData = useSelector((state) => state.spots.Reviews);
  const reviewsArray = Object.values(reviewsData);
  const reviewsCount = reviewsArray.length;

  return (
    <>
      {reviewsCount === 0
        ? ""
        : reviewsArray.map((review) => {
            const reviewDate = new Date(review.createdAt);
            const monthNumber = reviewDate.getMonth();
            reviewDate.setMonth(monthNumber - 1);
            const reviewMonthString = reviewDate.toLocaleString("en-US", {
              month: "long",
            });

            const yearNumber = reviewDate.getFullYear();

            return (
              <div id="individual_review_container" key={review.id}>
                <div id="review_title_button_container">
                  <h3 id="name_header">{review.User.firstName}</h3>
                  {sessionData.user &&
                    sessionData.user.id === review.User.id && (
                      <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteAReviewModal review={review} />}
                      />
                    )}
                </div>
                <h5>{`${reviewMonthString}, ${yearNumber}`}</h5>
                <p>{review.review}</p>
              </div>
            );
          })}
    </>
  );
}
