// LIBRARIES
import { useState, useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {

  const SET_DAY = "SET_DAY"
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA"
  const SET_INTERVIEW = "SET_INTERVIEW"
  
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

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
        const appointment = {
          ...state.appointments[action.id],
          interview: { ...action.interview }
        };
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        }
        ///////// requires fixing b/c will update for edit
        const days = updateSpots(action.id, true);

        return { ...state, appointments, days };
      },
      default: console.log(`Error with Reducer: ${action.type}`)
    };

    return reducers[action.type](state, action) || state;
  }

  // SET STATE
  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });

  // GET SERVER DATA ON LOAD
  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:8001";

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(data => {
        // setState(prev => ({...prev, days: data[0].data, appointments: data[1].data, interviewers: data[2].data}));
        const [ days, appointments, interviewers ] = [ data[0].data, data[1].data, data[2].data ];
        dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    }).catch(err => console.log(`Error with GET: ${err}`))
  }, []);

  // SET DAY IN SIDEBAR
  // const setDay = day => setState(prev => ({ ...prev, day }));
  const setDay = day => dispatch({ type: SET_DAY, day });

  // RETURN DAYS OBJECT WITH SPOTS UPDATED GIVEN APPOINTMENT ID AND WHETHER BOOKING OR NOT
  function updateSpots(id, isBooking) {
    ///////////check if id exists in state before updating
    const days = [ ...state.days ];
    for (const day of days) {
      if (day.appointments.includes(id)) {
        (isBooking) ? day.spots-- : day.spots++;
      }
    }
    return days;
  }

  // BOOK AN INTERVIEW GIVEN APPOINTMENT AND INTERVIEW DATA
  function bookInterview(id, interview, isNew) {
    // UPDATE DATA
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: { ...interview }
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    // const days = (isNew) ? updateSpots(id, true) : state.days;

    // UPDATE SERVER AND LOCAL WITH NEW DATA
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview })
        // setState({ ...state, days, appointments });
      })
  }

  // CANCEL AN INTERVIEW GIVEN APPOINTMENT
  function cancelInterview(id) {
    // // UPDATE DATA
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: null
    // };
    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };
    // const days = updateSpots(id, false);

    // UPDATE SERVER AND LOCAL DATA WITH NEW DATA
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, { interview: null })
      .then(() => {
        dispatch({ type: SET_INTERVIEW, id, interview: null });
        // setState({ ...state, days, appointments });
      })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}