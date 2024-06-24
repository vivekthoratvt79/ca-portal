import { combineReducers } from 'redux';
import auth from './auth';
import clients from './clients';
import employees from './employees';
import managers from './managers';

export default combineReducers({
  auth,
  clients,
  employees,
  managers,
});
