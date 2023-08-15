import React, { useState, useContext, useReducer, useEffect } from "react";
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
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_SUCCESS,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  STAT_JOB_BEGIN,
  STAT_JOB_SUCCESS,
  STAT_JOB_ERROR,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from "./actions";
import axios from "axios";

// const user = localStorage.getItem("user");
// const token = localStorage.getItem("token");
// const userLocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  userLoading: true,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: null,
  userLocation: "",
  jobLocation: "",
  showSidebar: false,
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobTypeOptions: ["full-time", "part-time", "internship"],
  jobType: "internship",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  jobs: [],
  totalJobs: 0,
  noOfPages: 1,
  page: 1,
  stats: "",
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const displayAlerts = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  //globally setup axios
  // axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`

  //custom instance method for bearer token
  const authFetch = axios.create({
    baseURL: "/api/v1",
    // headers: {
    //   Authorization: `Bearer ${state.token}`,
    // },
  });

  //request
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     config.headers["Authorization"] = `Bearer ${state.token}`;
  //     return config;
  //   },
  //   (error) => {
  //     return Promise.reject(error);
  //   }
  // );

  //response
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        console.log("Auth error");
      }
      return Promise.reject(error);
    }
  );

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async() => {
    // removeOnLocalStorage();
    await authFetch.get('/auth/logoutuser')
    dispatch({ type: LOGOUT_USER });
  };

  // const saveOnLocalStorage = ({ user, token, location }) => {
  //   localStorage.setItem("user", JSON.stringify(user));
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("location", location);
  // };

  // const removeOnLocalStorage = () => {
  //   localStorage.clear("user");
  //   localStorage.clear("token");
  //   localStorage.clear("location");
  // };

  const registerUser = async (currentUser) => {
    dispatch({ type: USER_REGISTER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/register", currentUser);
      console.log(response);

      const { user, location } = response.data;
      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: {
          user,
          location,
        },
      });
      // saveOnLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: USER_REGISTER_ERROR,
        payload: { msg: error.response.data.msg },
      });
      // removeOnLocalStorage();
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: USER_LOGIN_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/login", currentUser);
      const { user, location } = response.data;

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          user,
          location,
        },
      });
      // saveOnLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: USER_LOGIN_ERROR,
        payload: { msg: error.response.data.msg },
      });
      // removeOnLocalStorage();
    }
    clearAlert();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: USER_UPDATE_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateuser", currentUser);
      const { user, location } = data;

      dispatch({
        type: USER_UPDATE_SUCCESS,
        payload: {
          user,
          location,
        },
      });
      // saveOnLocalStorage({ user, token, location });
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

      // removeOnLocalStorage();
    }
    clearAlert();
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, status, jobType } = state;
      await authFetch.post("/jobs", {
        position,
        company,
        status,
        jobType,
        jobLocation,
      });
      dispatch({
        type: CREATE_JOB_SUCCESS,
        payload: { position, company, status, jobType, jobLocation },
      });
      clearValues();
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: CREATE_JOB_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const getJobs = async () => {
    dispatch({ type: GET_JOBS_BEGIN });

    const { search, searchStatus, searchType, sort, page } = state;
    let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}&page=${page}`;

    if (search) {
      url = url + `&search=${search}`;
    }
    try {
      const { data } = await authFetch.get(url);
      const { jobs, noOfPages, totalJobs } = data;

      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          noOfPages,
          totalJobs,
        },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
  };

  const setEditJob = (id) => {
    console.log(`Edit job : ${id}`);
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { company, position, jobType, status, jobLocation, editJobId } =
        state;
      await authFetch.patch(`/jobs/${editJobId}`, {
        company,
        position,
        jobType,
        status,
        jobLocation,
      });
      dispatch({
        type: EDIT_JOB_SUCCESS,
      });
      clearValues();
    } catch (error) {
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const deleteJob = async (id) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${id}`);
      // dispatch({ type: DELETE_JOB_SUCCESS, payload: {msg:'Job Deleted Successfully!'} });
      getJobs();
    } catch (error) {
      console.log(error);
      logoutUser();
    }
  };

  const statJobs = async () => {
    dispatch({ type: STAT_JOB_BEGIN });
    const url = "/jobs/stats";
    try {
      const { data } = await authFetch.get(url);
      const { defaultStats, monthlyApplications } = data;
      dispatch({
        type: STAT_JOB_SUCCESS,
        payload: {
          stats: defaultStats,
          monthlyApplications,
        },
      });
    } catch (error) {
      dispatch({ type: STAT_JOB_ERROR, payload: { msg: "Error in stats" } });
    }
    clearAlert();
  };

  useEffect(() => {
    getJobs();
  }, []);

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const clearFilters = () => {
    console.log("clear values");
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch("/auth/getcurrentuser");
      const { user, location } = data;

      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: {
          user,
          location,
        },
      });
    } catch (error) {
      if (error.response.status === 401) {
        return;
      }
      logoutUser();
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

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
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        statJobs,
        clearFilters,
        changePage,
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
