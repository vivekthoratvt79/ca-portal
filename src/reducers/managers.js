export default (state = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL_MANAGERS':
      return action.payload;
    default:
      return state;
  }
};
