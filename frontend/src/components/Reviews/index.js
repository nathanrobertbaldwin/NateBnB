import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import DeleteAReviewModal from "./DeleteReviewModal";
import "./Reviews.css";

export default function Reviews({ spot }) {
  const userId = useSelector((state) => state.session.user).id;

  const reviewsArray = Object.values(spot.Reviews);
  const reviewsCount = Object.values(spot.Reviews).length;

  return (
    <div id="reviews_container">
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
              <div key={review.id}>
                <h3>{review.User.firstName}</h3>
                <h4>{`${reviewMonthString}, ${yearNumber}`}</h4>
                <p>{review.review}</p>
                {userId === review.User.id && (
                  <Link to="/spots/${spot.id}/}">
                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={<DeleteAReviewModal review={review} />}
                    />
                  </Link>
                )}
              </div>
            );
          })}
    </div>
  );
}
