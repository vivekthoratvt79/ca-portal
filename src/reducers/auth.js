export default (state = { authData: null }, action) => {
  switch (action.type) {
    case 'AUTH':
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };
    case 'SIGNOUT':
      localStorage.removeItem('profile');
      return { ...state, authData: null };

    default:
      return state;
  }
};
