// ============================== IMPORTS ============================== //

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import {
  editASpotBySpotIdThunk,
  getSpotDetailsThunk,
  postNewSpotThunk,
} from "../../store/spots";
import "./UpdateASpotForm.css";

// ============================= EXPORTS ================================ //

export default function UpdateASpotForm() {
  // Variables

  const dispatch = useDispatch();
  const history = useHistory();

  const { spotId } = useParams();

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

  useEffect(() => {
    dispatch(getSpotDetailsThunk(spotId)).then((spot) => {
      setCountry(spot.country);
      setStreetAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setLatitude(spot.lat);
      setLongitude(spot.lng);
      setDescription(spot.description);
      setTitle(spot.name);
      setPrice(spot.price);
      setPreviewImage(spot.SpotImages[0].url);
      if (spot.SpotImages[1]) setImageOne(spot.SpotImages[1].url);
      if (spot.SpotImages[2]) setImageTwo(spot.SpotImages[2].url);
      if (spot.SpotImages[3]) setImageThree(spot.SpotImages[3].url);
      if (spot.SpotImages[4]) setImageFour(spot.SpotImages[4].url);
    });
  }, dispatch);

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
        spotId,
        address: streetAddress,
        city,
        state,
        country,
        lat: latitude,
        lng: longitude,
        name: title,
        description,
        price,
        previewImage,
        imageOne,
        imageTwo,
        imageThree,
        imageFour,
      };

      const newSpot = await dispatch(editASpotBySpotIdThunk(data));
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

  // Component Content

  return (
    <div id="new_spot_form_container">
      <h1 id="form_h1">Create A New Spot</h1>
      <form id="new_spot_form" onSubmit={handleSubmit}>
        <div className="new_spot_form_section">
          <h4 className="form_h4">Where's your place located?</h4>
          <p className="form_p">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            {validationErrors.country && hasSubmitted ? (
              <p>
                {"Country: "}
                <span className="error_message">
                  {validationErrors.country}
                </span>
              </p>
            ) : (
              "Country"
            )}
            <input
              className="new_spot_form_input"
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
                <span className="error_message">
                  {validationErrors.streetAddress}
                </span>
              </p>
            ) : (
              "Street Address"
            )}
            <input
              className="new_spot_form_input"
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
                <span className="error_message">{validationErrors.city}</span>
              </p>
            ) : (
              "City"
            )}
            <input
              className="new_spot_form_input"
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
                <span className="error_message">{validationErrors.state}</span>
              </p>
            ) : (
              "State"
            )}
            <input
              className="new_spot_form_input"
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
                <span className="error_message">
                  {validationErrors.latitude}
                </span>
              </p>
            ) : (
              "Latitude"
            )}
            <input
              className="new_spot_form_input"
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
                <span className="error_message">
                  {validationErrors.longitude}
                </span>
              </p>
            ) : (
              "Longitude"
            )}
            <input
              className="new_spot_form_input"
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
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
            />
            {validationErrors.description && hasSubmitted && (
              <span className="error_message">
                {validationErrors.description}
              </span>
            )}
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
            />
          </label>
          {validationErrors.title && hasSubmitted && (
            <span className="error_message">{validationErrors.title}</span>
          )}
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
            />
            {validationErrors.price && hasSubmitted && (
              <span className="error_message">{validationErrors.price}</span>
            )}
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
            />
            {validationErrors.previewImage && hasSubmitted && (
              <span className="error_message">
                {validationErrors.previewImage}
              </span>
            )}
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
