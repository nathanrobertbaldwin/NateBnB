// ============================== IMPORTS ============================== //

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { postNewSpotThunk } from "../../store/spots";
import "./NewSpotForm.css";

// ============================= EXPORTS =============================== //

export default function NewSpotForm() {
  // Variables

  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector((state) => state.session.user);
  const userId = userData.id;
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageOne, setImageOne] = useState("");
  const [imageTwo, setImageTwo] = useState("");
  const [imageThree, setImageThree] = useState("");
  const [imageFour, setImageFour] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Error Checking

  useEffect(() => {
    _checkForErrors();
  }, [
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
  ]);

  // Submit Handler

  async function handleSubmit(e) {
    e.preventDefault();
    setHasSubmitted(true);

    if (Object.values(validationErrors).length === 0) {
      let data = {
        ownerId: userId,
        country,
        address: streetAddress,
        city,
        state,
        lat: latitude,
        lng: longitude,
        description,
        name: title,
        price,
        previewImage,
        imageOne,
        imageTwo,
        imageThree,
        imageFour,
      };

      const newSpot = await dispatch(postNewSpotThunk(data));
      _reset();
      history.push(`/spots/${newSpot.id}`);
    }
  }

  // Helper Functions

  function _checkForErrors() {
    const errors = {};
    if (!country) errors.country = "Country is required";
    if (!streetAddress) errors.streetAddress = "Street Address is required";
    if (!city) errors.city = "City is required";
    if (!state || state.length !== 2)
      errors.state = "A two letter State is required";
    if (latitude < -90 || latitude > 90)
      errors.latitude = "A numeric latitude between -90 and 90 is required.";
    if (longitude < -180 || longitude > 180)
      errors.longitude =
        "A numeric longitude between -180 and 180 is required.";
    if (description.length < 30)
      errors.description = "Description needs a minimum of 30 characters";
    if (!title) errors.title = "Title is required";
    if (!price) errors.price = "Price is required";
    if (!previewImage)
      errors.previewImage = "Preview Image is required in form of a URL";
    setValidationErrors(errors);
  }

  function _reset() {
    setCountry("");
    setStreetAddress("");
    setCity("");
    setState("");
    setLatitude(0);
    setLongitude(0);
    setDescription("");
    setTitle("");
    setPrice(0);
    setPreviewImage("");
    setImageOne("");
    setImageTwo("");
    setImageThree("");
    setImageFour("");
    setValidationErrors({});
  }

  // Component

  return (
    <div id="new_spot_form_container">
      <h1 id="new_spot_form_h1">Create A New Spot</h1>
      <form id="new_spot_form" onSubmit={handleSubmit}>
        <div id="new_spot_form_section">
          <h4 id="new_spot_form_h4">Where's your place located?</h4>
          <p id="new_spot_form_p">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            {validationErrors.country && hasSubmitted ? (
              <p>
                {"Country: "}
                <span id="error_message">{validationErrors.country}</span>
              </p>
            ) : (
              "Country"
            )}
            <input
              id="new_spot_form_input"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>
          <label>
            {validationErrors.streetAddress && hasSubmitted ? (
              <p>
                {"Street Address: "}
                <span id="error_message">{validationErrors.streetAddress}</span>
              </p>
            ) : (
              "Street Address"
            )}
            <input
              id="new_spot_form_input"
              type="text"
              placeholder="Street Address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </label>
          <label>
            {validationErrors.city && hasSubmitted ? (
              <p>
                {"City: "}
                <span id="error_message">{validationErrors.city}</span>
              </p>
            ) : (
              "City"
            )}
            <input
              id="new_spot_form_input"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <label>
            {validationErrors.state && hasSubmitted ? (
              <p>
                {"State: "}
                <span id="error_message">{validationErrors.state}</span>
              </p>
            ) : (
              "State"
            )}
            <input
              id="new_spot_form_input"
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          <label>
            {validationErrors.latitude && hasSubmitted ? (
              <p>
                {"Latitude: "}
                <span id="error_message">{validationErrors.latitude}</span>
              </p>
            ) : (
              "Latitude"
            )}
            <input
              id="new_spot_form_input"
              type="number"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </label>
          <label>
            {validationErrors.longitude && hasSubmitted ? (
              <p>
                {"Longitude: "}
                <span id="error_message">{validationErrors.longitude}</span>
              </p>
            ) : (
              "Longitude"
            )}
            <input
              id="new_spot_form_input"
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </label>
        </div>
        <div id="new_spot_form_section">
          <h4 id="new_spot_form_h4">Describe your place to guests</h4>
          <p id="new_spot_form_p">
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </p>
          <label>
            <textarea
              id="new_spot_spot_description_field"
              placeholder="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
            />
            {validationErrors.description && hasSubmitted && (
              <span id="error_message">{validationErrors.description}</span>
            )}
          </label>
        </div>
        <div id="new_spot_form_section">
          <h4 id="new_spot_form_h4">Create a title for your spot</h4>
          <p id="new_spot_form_p">
            Catch guests' attention with a spot title that highlights what makes
            your place special
          </p>
          <label>
            <input
              id="new_spot_form_input"
              type="text"
              placeholder="Name Of Your Spot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          {validationErrors.title && hasSubmitted && (
            <span id="error_message">{validationErrors.title}</span>
          )}
        </div>
        <div id="new_spot_form_section">
          <h4 id="new_spot_form_h4">Set a base price for your spot</h4>
          <p id="new_spot_form_p">
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <label id="new_spot_form_price_label">
            <p id="new_form_dollar_sign">$&nbsp;&nbsp;</p>
            <input
              id="new_spot_form_input"
              type="number"
              step="0.01"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {validationErrors.price && hasSubmitted && (
              <span id="error_message">{validationErrors.price}</span>
            )}
          </label>
        </div>
        <div id="new_spot_form_section">
          <h4 id="new_spot_form_h4">Liven up your spot with photos</h4>
          <p id="new_spot_form_p">
            Submit a link to at least one photo to publish your spot.
          </p>
          <label>
            <input
              id="new_spot_form_input"
              type="url"
              placeholder="Preview Image URL"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
            />
            {validationErrors.previewImage && hasSubmitted && (
              <span id="error_message">{validationErrors.previewImage}</span>
            )}
          </label>
          <label>
            <input
              id="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageOne}
              onChange={(e) => setImageOne(e.target.value)}
            />
          </label>
          <label>
            <input
              id="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageTwo}
              onChange={(e) => setImageTwo(e.target.value)}
            />
          </label>
          <label>
            <input
              id="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageThree}
              onChange={(e) => setImageThree(e.target.value)}
            />
          </label>
          <label>
            <input
              id="new_spot_form_input"
              type="url"
              placeholder="Image URL"
              value={imageFour}
              onChange={(e) => setImageFour(e.target.value)}
            />
          </label>
        </div>
        <div id="new_spot_button_container">
          <button type="submit" className="button_small">
            Create Spot
          </button>
        </div>
      </form>
    </div>
  );
}
