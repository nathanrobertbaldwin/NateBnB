import "./SpotCard.css";

export function SpotCard({ spot }) {
  const rating = spot.avgRating ? spot.avgRating : "no reviews";
  return (
    <div className="spot_card">
      <div className="spot_preview_image">
        <img src={spot.previewImage} />
      </div>
      <div className="">
        <div>{`${spot.city}, ${spot.state}`}</div>
        <div>{`Stars: ${rating}`}</div>
      </div>
      <div>{`$${spot.price} / night`}</div>
    </div>
  );
}
