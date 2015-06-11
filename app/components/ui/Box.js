import React from 'react'
import cx from 'classnames'
import _ from 'underscore'
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

  _getDivProps() {
    return _.omit(this.props, [
      'column',
      'grow',
      'padding',
      'verticalAlign',
      'className',
      'children'
    ]);
  },

  render() {
    return (
      <div
        className={
          cx(
            styles.box,
            this.props.grow && styles.grow,
            this.props.padding && styles.padding,
            this.props.column && styles.column,
            this.props.verticalAlign && styles.verticalAlign,
            this.props.noCollapse && styles.noCollapse,
            this.props.className
          )
        }
        {...this._getDivProps()}>
        {this.props.children}
      </div>
    )
  }
});

export default Box
