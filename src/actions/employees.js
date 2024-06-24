import * as api from '../api';

export const fetchAgentsForManager = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchAgentsForManager(id); //API CALL
    dispatch({ type: 'FETCH_ALL_EMPLOYEES', payload: data.data.employees });
  } catch (error) {
    console.log(error);
  }
};
