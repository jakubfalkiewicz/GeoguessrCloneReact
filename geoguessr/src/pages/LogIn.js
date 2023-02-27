import React, { useEffect, useState } from "react";
import "../styles/SignUp.css";
import { connect } from "react-redux";
import { loginUser } from "../ducks/auth/actions";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { getToken } from "../selectors";

function LogIn({ loginUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = useSelector(getToken);

  useEffect(() => {
    if (token) {
      Cookies.set("token", token.token, {
        httpOnly: true,
        secure: true,
        expires: 7,
      });
      const decodedToken = jwtDecode(token.token);
      console.log(decodedToken);
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    loginUser({ email, password });
  };
  return (
    <div className="forms-container">
      <div className="navbar-container"></div>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
const mapStateToProps = (state, props) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = {
  loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);
