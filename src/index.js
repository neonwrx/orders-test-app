import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'

import { firebaseApp, userListRef } from './firebase';
import { logUser } from './actions';
import { ConnectedRouter, push } from 'react-router-redux'

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import App from './components/App';
import Orders from './components/Orders';
import NewOrder from './components/NewOrder';
// import reducer_orders from './reducers/reducer_orders';
import reducer from './reducers';


import './styles/main.css';
import 'bootstrap/dist/css/bootstrap.css';

// import reducers from './reducers' // Or wherever you keep your reducers

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
// const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
// const store = createStore(
//   combineReducers({
//     ...reducer,
//     // ...reducer_orders,
//     router: routerReducer
//   }),
//   applyMiddleware(middleware),
//   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// )
const store = createStore(
  reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Now you can dispatch navigation actions from anywhere!
store.dispatch(push('/app'));
// history.push('/app');

firebaseApp.auth().onAuthStateChanged(user => {
  if (user) {
    // console.log('user has signed in or up', user);
    const { email } = user;
    const logEmail = email;

    userListRef.on('value', snap => {
      let currentUser = {};
      snap.forEach(usr => {
        const { email, userName } = usr.val();
        const serverKey = usr.key;
        if (email === logEmail) {
          // console.log('test', logEmail);
          currentUser.email = email;
          currentUser.userName = userName;
          currentUser.serverKey = serverKey;
        }
      });
      store.dispatch(logUser(currentUser));
    });

    // if ((!history.location.pathname.includes('tasks')) && (!history.location.pathname.includes('cabinet'))) {
      history.push('/app');
    // }
  } else {
    // console.log('user has signed out or still needs to sign in.');
    history.replace('/signin');
  }
});

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <div>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route exact path="/app" component={App}/>
        <Route path="/orders" component={Orders}/>
        <Route path="/new-order" component={NewOrder}/>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
