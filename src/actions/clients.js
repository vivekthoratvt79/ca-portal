import * as api from '../api';

//Action Creator
export const getClients = () => async (dispatch) => {
  try {
    const { data } = await api.fetchClients(); //API CALL
    dispatch({ type: 'FETCH_ALL_CLIENTS', payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const fetchClientsForAgent = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchClientsForAgent(id); //API CALL
    dispatch({ type: 'FETCH_ALL_CLIENTS', payload: data });
  } catch (error) {
    console.log(error);
  }
};
