// LIBRARIES
import { useEffect, useReducer } from "react";
import axios from "axios";

// REDUCER ACTION TYPES
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// UPDATE STATE WITH REDUCER
function reducer(state, action) {

  const reducers = {
    SET_DAY(state, action) {
      return { ...state, day: action.day };
    },
    SET_APPLICATION_DATA(state, action) {
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers };
    },
    SET_INTERVIEW(state, action) {
      // UPDATE SPOTS
      function updateSpots(id, isBooking) {
        const days = [ ...state.days ];
        for (const day of days) {
          if (day.appointments.includes(id)) {
            (isBooking) ? day.spots-- : day.spots++;
          }
        }
        return days;
      }
      
      const appointment = {
        ...state.appointments[action.id],
        interview: { ...action.interview }
      };
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      }
      const days = (action.isEdit) ? state.days : updateSpots(action.id, action.isBooking);
      
      return { ...state, appointments, days };
    }
  };

  return reducers[action.type](state, action) || state;
}

export default function useApplicationData() {
  
  // DECLARE STATE
  const [ state, dispatch ] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // GET SERVER DATA ON LOAD
  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:8001";

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(data => {
      const [ days, appointments, interviewers ] = [ data[0].data, data[1].data, data[2].data ];
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    }).catch(err => console.log("Error with GET: ", err));
  }, []);

  // CHANGE DAY IN SIDEBAR WHEN CLICKED
  const setDay = day => dispatch({ type: SET_DAY, day });

  // BOOK AN INTERVIEW GIVEN APPOINTMENT AND INTERVIEW DATA
  function bookInterview(id, interview, isEdit) {
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview, isBooking: true, isEdit })
      })
      .catch(err => console.log("Error with bookInterview: ", err));
  }

  // CANCEL AN INTERVIEW GIVEN APPOINTMENT
  function cancelInterview(id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, { interview: null })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null, isBooking: false });
      })
      .catch(err => console.log("Error with cancelInterview: ", err));
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}