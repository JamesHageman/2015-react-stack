import React, {Component} from 'react'
import Box from '../ui/Box'
import {RouteHandler} from 'react-router'

class MainSection extends Component {
  render() {
    return (
      <Box grow>
        <RouteHandler {...this.props}/>
      </Box>
    );
  }
}

export default MainSection