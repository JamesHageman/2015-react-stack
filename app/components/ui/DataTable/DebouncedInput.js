import React from 'react';

var DebouncedInput = React.createClass({
  propTypes: {
    delay: React.PropTypes.number,
    autoSelect: React.PropTypes.bool,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      delay: 500,
      autoSelect: false
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  },

  getInitialState() {
    return {
      value: this.props.value
    };
  },

  _handleChange(e) {
    var value = e.target.value;
    this.setState({
      value: value
    });

    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      this.props.onChange(value);
    }, this.props.delay);
  },

  _handleFocus(e) {
    if (this.props.autoSelect) {
      setTimeout(() => {
        React.findDOMNode(this).select();
      });
    }
  },

  render() {
    return <input
      {...this.props}
      onChange={this._handleChange}
      value={this.state.value}
      onFocus={this._handleFocus}
    />;
  }
});

export default DebouncedInput;
