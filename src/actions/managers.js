import * as api from '../api';

//Action Creator
export const fetchForAdmin = (role, id) => async (dispatch) => {
  try {
    const { data } = await api.fetchForAdmin(role, id); //API CALL
    if (role == 'manager') {
      dispatch({ type: 'FETCH_ALL_MANAGERS', payload: data.data.managers });
    } else if (role == 'client') {
      dispatch({ type: 'FETCH_ALL_CLIENTS', payload: data.data.clients });
    } else if (role == 'agent') {
      dispatch({ type: 'FETCH_ALL_EMPLOYEES', payload: data.data.agents });
    }
  } catch (error) {
    console.log(error);
  }
};

export const addManager = (userData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.register(userData); //API CALL
    console.log('manager', data);
    if (data.status == 200) {
      dispatch({ type: 'ADD_MANAGER', payload: data.data });
    }
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
