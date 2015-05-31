import React from 'react'
import classNames from 'classnames'
import Radium from 'radium'
import color from 'color'
import { SCREEN_SMALL, PADDING } from '../../constants/UIConstants'

var Box = React.createClass({
  propTypes: {
    column: React.PropTypes.bool,
    grow: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.bool
    ]),
    padding: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      column: false,
      grow: false,
      padding: true
    };
  },

  render() {
    return (
      <div
        style={[
          styles.box,
          this.props.column && styles.column,
          this.props.padding && styles.padding,
          styles.grow(this.props.grow)
        ]}>

        {this.props.children}

      </div>
    )
  }
});

var styles = {
  box: {
    display: 'flex',
    flexDirection: 'row',
    [SCREEN_SMALL]: {
      flexDirection: 'column'
    }
  },
  column: {
    flexDirection: 'column'
  },
  padding: {
    padding: PADDING
  },
  grow(val) {
    if (val === false) {
      return undefined;
    }
    if (val === true) {
      return { flexGrow: 1 };
    }
    return { flexGrow: val };
  }
};

export default Radium.Enhancer(Box)
