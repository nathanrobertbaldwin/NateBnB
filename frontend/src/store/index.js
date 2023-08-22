// ============================== IMPORTS ============================== //

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import { spotsReducer } from "./spots";
import { mapsReducer } from "./maps";

// =========================== ROOT REDUCER ============================ //

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  maps: mapsReducer,
});

// ============================= ENHANCER ============================== //

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// ========================= CONFIGURE STORE =========================== //

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

// ============================= EXPORTS =============================== //

export default configureStore;
