// ============================== IMPORTS ============================== //

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./NewSpotForm.css";

// ============================= EXPORTS =============================== //

export default function () {
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSpot = {
      country,
      streetAddress,
      city,
      state,
      latitude,
      longitude,
      description,
      title,
      price,
      previewImage,
      imageOne,
      imageTwo,
      imageThree,
      imageFour,
    };

    console.log(newSpot);

    // history.push(""); remember to add new spot address
  };

  return (
    <div id="new_spot_form_container">
      <h1>Create A New Spot</h1>
      <form onSubmit={handleSubmit}>
        <div className="new_spot_form_section">
          <h4 className="form_h4">Where's your place located?</h4>
          <p className="form_p">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            Country
            <input
              className="new_spot_form_input"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>
          <label>
            Street Address
            <input
              className="new_spot_form_input"
              type="text"
              placeholder="Street Address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
            />
          </label>
          <label>
            City
            <input
              className="new_spot_form_input"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          <label>
            State
            <input
              className="new_spot_form_input"
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </label>
          <label>
            Latitude
            <input
              className="new_spot_form_input"
              type="number"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />
          </label>
          <label>
            Longitude
            <input
              className="new_spot_form_input"
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="new_spot_form_section">
          <h4 className="form_h4">Describe your place to guests</h4>
          <p className="form_p">
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </p>
          <label>
            <textarea
              placeholder="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              cols="50"
              required
            />
          </label>
        </div>
        <div className="new_spot_form_section">
          <h4 className="form_h4">Create a title for your spot</h4>
          <p className="form_p">
            Catch guests' attention with a spot title that highlights what makes
            your place special
          </p>
          <label>
            <input
              className="new_spot_form_input"
              type="text"
              placeholder="Name Of Your Spot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="new_spot_form_section">
          <h4 className="form_h4">Set a base price for your spot</h4>
          <p className="form_p">
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <label>
            $
            <input
              className="new_spot_form_input"
              type="number"
              step="0.01"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="new_spot_form_section">
          <h4 className="form_h4">Liven up your spot with photos</h4>
          <p className="form_p">
            Submit a link to at least one photo to publish your spot.
          </p>
          <label>
            <input
              className="new_spot_form_input"
              type="url"
              placeholder="Preview Image URL"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              required
            />
          </label>
          <label>
            <input
              className="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageOne}
              onChange={(e) => setImageOne(e.target.value)}
            />
          </label>
          <label>
            <input
              className="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageTwo}
              onChange={(e) => setImageTwo(e.target.value)}
            />
          </label>
          <label>
            <input
              className="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageThree}
              onChange={(e) => setImageThree(e.target.value)}
            />
          </label>
          <label>
            <input
              className="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageFour}
              onChange={(e) => setImageFour(e.target.value)}
            />
          </label>
        </div>
        <div id="button_container">
          <button type="submit" id="new_spot_form_submit">
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
}
