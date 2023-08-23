// frontend/src/components/Maps/index.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getKey } from "../../store/maps";
import Maps from "./Maps";

const MapContainer = () => {
  const key = useSelector((state) => state.maps.key);
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots);

  useEffect(() => {
    if (!key) {
      dispatch(getKey());
    }
  }, [dispatch, key]);

  if (!key) {
    return null;
  }

  return <Maps apiKey={key} lat={spot.lat} lng={spot.lng} />;
};

export default MapContainer;
