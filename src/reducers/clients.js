export default (clients = [], action) => {
  switch (action.type) {
    case 'FETCH_ALL_CLIENTS':
      return action.payload;
    default:
      return clients;
  }
};
