// frontend/src/components/LoginFormModal/index.js

// ============================== IMPORTS ============================== //

import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

// ============================= EXPORTS =============================== //

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoUser = () => {
    dispatch(
      sessionActions.login({ credential: "Demolition", password: "password" })
    ).then(closeModal);
  };

  return (
    <div id="login_form_modal_container">
      <h1 id="login_form_modal_h1">Log In</h1>
      <form id="login_form" onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label id="login_form_label">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <div id="login_form_button_container">
          <button className="button_small" type="submit">
            Log In
          </button>
          <button className="button_small" onClick={handleDemoUser}>
            Demo User
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
