import axios from "axios";
import types from "./types";
import Cookies from "js-cookie";

export const loginUserAction = (user) => ({
  type: types.LOGIN_SUCCESS,
  payload: { token: user },
});

export const logoutUserAction = (user) => ({
  type: types.LOGIN_SUCCESS,
  payload: { token: user },
});

export const loginUser = (user) => {
  console.log(user);
  return async (dispatch) => {
    axios({
      method: "post",
      //   url: "https://mongodb-api.onrender.com/users/login",
      url: "http://localhost:4000/users/login",
      data: user,
    })
      .then((response) => {
        dispatch(loginUserAction(response.data));
      })
      .catch((error) => console.log(error));
  };
};

export const logoutUser = (user) => {
  return async (dispatch) => {
    axios({
      method: "post",
      url: "https://mongodb-api.onrender.com/users/logout",
      data: user,
    })
      .then((response) => {
        dispatch(logoutUserAction(response.data));
      })
      .catch((error) => console.log(error));
  };
};
