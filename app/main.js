/* main.js - the entry point of the application */

import './body.global.less';

import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
import UserActions from './actions/UserActions';

window.jQuery = $;
var mountNode = document.body;

// we use require() for routes so everything in the app loads after
// window.jQuery is set.
var routes = require('./routes');

React.initializeTouchEvents(true);

Router.run(routes, (Root, state) => {
  React.render(<Root {...state}/>, mountNode);
});

UserActions.checkSession();
