import React from 'react'
import {Route} from 'react-router'

import App from './components/containers/App'
import Home from './components/containers/Home'
import About from './components/containers/About'

export default (
  <Route handler={App}>
    <Route name="home" path="/" handler={Home}/>
    <Route name="about" handler={About}/>
  </Route>
);