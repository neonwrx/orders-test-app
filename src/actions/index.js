import { SIGNED_IN, SET_ORDERS } from '../constants';

export function logUser(currentUser) {
  const action = {
    type: SIGNED_IN,
    currentUser
  }
  return action;
}

export function setOrders(orders) {
  const action = {
    type: SET_ORDERS,
    orders
  }
  return action;
}
