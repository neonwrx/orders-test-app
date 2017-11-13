import { SET_ORDERS } from '../constants';

export default (state = [], action) => {
  switch(action.type) {
    case SET_ORDERS:
      const { orders } = action;
      return orders;
    default:
      return state;
  }
}
