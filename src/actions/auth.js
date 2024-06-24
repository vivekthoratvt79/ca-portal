import * as api from '../api';

//Action Creator
export const signupAction = (userData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signup(userData); //API CALL
    dispatch({ type: 'AUTH', data: data });
    navigate('/');
  } catch (error) {
    console.log(error);
  }
};

export const signin = (userData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signin(userData); //API CALL
    dispatch({ type: 'AUTH', data: data.data });
    navigate('/');
  } catch (error) {
    console.log(error);
  }
};

export const syncUserData = (userData) => async (dispatch) => {
  try {
    dispatch({ type: 'AUTH', data: userData });
  } catch (error) {
    console.log(error);
  }
};

export const signout = (navigate) => async (dispatch) => {
  try {
    dispatch({ type: 'SIGNOUT' });
    navigate('/');
  } catch (error) {
    console.log(error);
  }
};
