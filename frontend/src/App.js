import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotDetails from "./components/SpotDetails";
import NewSpotForm from "./components/NewSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateASpotForm from "./components/UpdateASpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotsIndex />
          </Route>
          <Route exact path="/spots/new">
            <NewSpotForm />
          </Route>
          <Route exact path="/spots/current">
            <ManageSpots />
          </Route>
          <Route exact path="/spots/:spotId/edit">
            <UpdateASpotForm />
          </Route>
          <Route exact path="/spots/:spotId">
            <SpotDetails />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
