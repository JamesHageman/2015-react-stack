import 'normalize.css'
import './body.css'

import React from 'react'
import App from './components/containers/App'
import Router from 'react-router'
import routes from './routes'
import UserActions from './actions/UserActions'

var mountNode = document.body;

Router.run(routes, (Root, state) => {
  React.render(<Root {...state}/>, mountNode);
});

UserActions.checkSession();
