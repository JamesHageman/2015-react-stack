import Box from './Box'
import React from 'react'
import Radium from 'radium'
import {FONT_BASE, BACKGROUND} from '../../constants/UIConstants'
import styles from '../stylesheets/TopLevelBox.css'

var TopLevelBox = React.createClass({
  render() {
    return (
      <div className={styles.base}>
        {this.props.children}
      </div>
    );
  }
});

export default TopLevelBox
