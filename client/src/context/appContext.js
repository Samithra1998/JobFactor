import React, { useState, useContext, useReducer } from "react";
import reducer from "./reducer";
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  USER_REGISTER_BEGIN,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_ERROR,
  USER_LOGIN_BEGIN,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_ERROR,
} from "./actions";
import axios from "axios";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const userLocation = localStorage.getItem("userLocation");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse("user") : null,
  token: token ? token : null,
  userLocation: userLocation || "",
  jobLocation: userLocation || "",
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlerts = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const saveOnLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeOnLocalStorage = () => {
    localStorage.clear("user");
    localStorage.clear("token");
    localStorage.clear("location");
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: USER_REGISTER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/register", currentUser);
      console.log(response);

      const { user, token, location } = response.data;
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
      saveOnLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: USER_REGISTER_ERROR,
        payload: { msg: error.response.data.msg },
      });
      removeOnLocalStorage();
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: USER_LOGIN_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/login", currentUser);
      const { user, token, location } = response.data;

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
      saveOnLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: USER_LOGIN_ERROR,
        payload: { msg: error.response.data.msg },
      });
      removeOnLocalStorage();
    }
  };

  return (
    <AppContext.Provider
      value={{ ...state, displayAlerts, registerUser, loginUser }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
