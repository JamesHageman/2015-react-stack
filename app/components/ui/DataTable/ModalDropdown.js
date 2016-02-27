import React from 'react';
import PureRenderMixin from 'react-pure-render/mixin';
import $ from 'jquery';
// import isTouchDevice from '../../helpers/isTouchDevice';

// var ANIMATION_DURATION = 150;

var overlayStyle = {
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  position: 'fixed',
  zIndex: 1000,
  overflowY: 'auto'
};

var ModalDropdown = React.createClass({
  propTypes: {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    onRequestClose: React.PropTypes.func.isRequired,

    overlayBackground: React.PropTypes.string,

    widthOffset: React.PropTypes.number,
    heightOffset: React.PropTypes.number,

    closeOnClick: React.PropTypes.bool
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      overlayBackground: 'rgba(0,0,0,0.2)',
      widthOffset: 220,
      heightOffset: 300,
      closeOnClick: false
    };
  },

  getInitialState() {
    var $win = $(window);
    return {
      windowWidth: $win.width(),
      windowHeight: $win.height()
    };
  },

  componentDidMount() {
    $(window).on('resize', this._handleResize);
  },

  componentWillUnmount() {
    $(window).off('resize', this._handleResize);
  },

  // componentWillEnter(cb) {
  //   var overlay = this._getOverlay();
  //   var dropdown = this._getDropdown();

  //   overlay.hide().fadeIn(ANIMATION_DURATION, cb);
  //   dropdown.hide().fadeIn(ANIMATION_DURATION);
  // },

  // componentWillLeave(cb) {
  //   var overlay = this._getOverlay();
  //   var dropdown = this._getDropdown();

  //   overlay.fadeOut(ANIMATION_DURATION, cb);
  //   dropdown.fadeOut(ANIMATION_DURATION);
  // },

  _getOverlay() {
    return $(React.findDOMNode(this.refs.overlay));
  },

  _getDropdown() {
    return $(React.findDOMNode(this.refs.dropdown));
  },

  _handleResize() {
    var $win = $(window);
    this.setState({
      windowWidth: $win.width(),
      windowHeight: $win.height()
    });
  },

  _handleOverlayClick(e) {
    var {closeOnClick} = this.props;
    if (e.target === React.findDOMNode(this.refs.overlay) || closeOnClick) {
      this.props.onRequestClose();
      e.stopPropagation();
    }
  },

  render() {
    var {windowWidth, windowHeight} = this.state;
    var {x, y} = this.props;
    var dropdownStyle = {
      left: Math.min(x, windowWidth - this.props.widthOffset) + 'px',
      top: Math.min(y, windowHeight - this.props.heightOffset) + 'px',
      position: 'absolute'
    };

    return <div
      style={{
        ...overlayStyle,
        background: this.props.overlayBackground
      }}
      onClick={this._handleOverlayClick}
      ref="overlay"
      role="button">
      <div className="dropdown" style={dropdownStyle} ref="dropdown">
        {this.props.children}
      </div>
    </div>;
  }
});

export default ModalDropdown;
