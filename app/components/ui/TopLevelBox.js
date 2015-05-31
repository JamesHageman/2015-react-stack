import Box from './Box'
import React from 'react'
import Radium from 'radium'
import {FONT_BASE, BACKGROUND} from '../../constants/UIConstants'

var TopLevelBox = React.createClass({
  render() {
    return (
      <div style={[styles.base]}>
        {this.props.children}
      </div>
    );
  }
});

var styles = {
  base: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: 0,
    margin: 0,
    backgroundColor: BACKGROUND,
    fontSize: FONT_BASE
  }
};

export default Radium.Enhancer(TopLevelBox)
