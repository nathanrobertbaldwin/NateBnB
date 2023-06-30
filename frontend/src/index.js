// ============================== IMPORTS ============================== //

import React from "react";

import "./index.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// ========================= CONFIGURE STORE =========================== //

import configureStore from "./store";

const store = configureStore();

// =================== ADD STORE TO WINDOW IN PROD ===================== //

if (process.env.NODE_ENV !== "production") {
  window.store = store;
}

// ======================= CREATE ROOT COMPONENT ======================= //

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
