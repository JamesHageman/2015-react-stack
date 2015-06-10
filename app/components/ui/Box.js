import React from 'react'
import classNames from 'classnames'

import styles from '../stylesheets/Box.css'

var Box = React.createClass({
  propTypes: {
    column: React.PropTypes.bool,
    grow: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.bool
    ]),
    padding: React.PropTypes.bool,
    verticalAlign: React.PropTypes.bool,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      column: false,
      grow: false,
      padding: true,
      verticalAlign: false,
      className: ''
    };
  },

  render() {
    return (
      <div className={
        classNames(
          styles.box,
          this.props.grow && styles.grow,
          this.props.padding && styles.padding,
          this.props.column && styles.column,
          this.props.verticalAlign && styles.verticalAlign,
          this.props.className
        )
      }>
        {this.props.children}
      </div>
    )
  }
});

export default Box
