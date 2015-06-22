/* main.js - the entry point of the application */

import './body.global.less';

import $ from 'jquery';
import React from 'react';
import Router from 'react-router';
import UserActions from './actions/UserActions';
import routes from './routes';

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

UserActions.checkSession();

$(document).ready(() => {
  var mountNode = document.body;

  Router.run(routes, (Root, state) => {
    React.render(<Root {...state}/>, mountNode);
  });
});
