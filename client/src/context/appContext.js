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
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  USER_UPDATE_BEGIN,
  USER_UPDATE_ERROR,
  USER_UPDATE_SUCCESS,
} from "./actions";
import axios from "axios";

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const userLocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token ? token : null,
  userLocation: userLocation || "",
  jobLocation: userLocation || "",
  showSidebar: false,
  isEditing:false,
  editJobId:'',
  position:'',
  company:'',
  jobTypeOptions:["full-time", "part-time", "internship"],
  jobType:'internship',
  statusOptions:["interview", "declined", "pending"],
  status:'pending'
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlerts = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  //globally setup axios
  // axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`

  //custom instance method for bearer token
  const authFetch = axios.create({
    baseURL: "/api/v1",
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });

  // //request
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     config.headers.common["Authorization"] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  // //response
  // authFetch.interceptors.response.use(
  //   (response) => {

  //     return response;
  //   },
  //   (error) => {
  //     if(error.response.status === 401) {
  //       console.log('Auth error');
  //     }
  //     return Promise.reject(error);
  //   }
  // );

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    removeOnLocalStorage();
    dispatch({ type: LOGOUT_USER });
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
    clearAlert()
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: USER_UPDATE_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateuser", currentUser);
      const { user, token, location } = data;

      dispatch({
        type: USER_UPDATE_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
      saveOnLocalStorage({ user, token, location });
      console.log(data);
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: USER_UPDATE_ERROR,
          payload: {
            msg: error.response.data.msg,
          },
        });
      }

      removeOnLocalStorage();
    }
    clearAlert();
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlerts,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
