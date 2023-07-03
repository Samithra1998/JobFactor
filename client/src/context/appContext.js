import React, { useState, useContext, useReducer } from "react";
import reducer from "./reducer";
import {
  CLEAR_ALERT,
  DISPLAY_ALERT,
  USER_REGISTER_BEGIN,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_ERROR,
} from "./actions";
import axios from "axios";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: null,
  token: null,
  userLocation: "",
  jobLocation:"",
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
    } catch (error) {
      console.log(error.response);
      dispatch({type: USER_REGISTER_ERROR,payload:{msg:error.response.data.msg}})
    }
    clearAlert()
  };

  return (
    <AppContext.Provider value={{ ...state, displayAlerts, registerUser }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
