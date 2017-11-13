import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import user from './reducer_user';
import orders from './reducer_orders';

export default combineReducers({
  router: routerReducer,
  user,
  orders
});
