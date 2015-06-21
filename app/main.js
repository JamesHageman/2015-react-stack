/* main.js - the entry point of the application */

import './body.global.less';

import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
import UserActions from './actions/UserActions';
import routes from './routes';

var mountNode = document.body;

$.notifyDefaults({
  placement: {
    align: 'center'
  },
  animate: {
    enter: 'animated fadeInDown',
    exit: 'animated fadeOutUp'
  }
});

React.initializeTouchEvents(true);

Router.run(routes, (Root, state) => {
  React.render(<Root {...state}/>, mountNode);
});

UserActions.checkSession();
