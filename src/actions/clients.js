import * as api from '../api';

export const fetchClientsForAgent = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchClientsForAgent(id); //API CALL
    dispatch({ type: 'FETCH_ALL_CLIENTS', payload: data.data.clients });
  } catch (error) {
    console.log(error);
  }
};
