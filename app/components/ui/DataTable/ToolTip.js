import React from 'react';
import $ from 'jquery';
import './stylesheets/Tooltip.less';
import 'bootstrap/js/tooltip.js';
import PureRenderMixin from 'react-pure-render/mixin';
import isTouchDevice from './isTouchDevice';

var Tooltip = React.createClass({
  propTypes: {
    placement: React.PropTypes.string,
    content: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      placement: 'top',
      content: ''
    };
  },

  componentDidMount() {
    var $elem = this._getTooltipElem();
    $elem.tooltip(this._getTooltipOptions());
  },

  componentWillUnmount() {
    var $elem = this._getTooltipElem();
    $elem.tooltip('destroy');
  },

  _getTooltipOptions() {
    return {
      title: () => this.props.content,
      placement: this.props.placement,
      trigger: 'hover',
      container: 'body'
    };
  },

  _getTooltipElem() {
    return $(React.findDOMNode(this));
  },

  render() {
    return React.Children.only(this.props.children);
  }
});

var MobileTooltip = React.createClass({
  render() {
    var elem = React.Children.only(this.props.children);
    return elem;
  }
});

export default isTouchDevice ? MobileTooltip : Tooltip;
