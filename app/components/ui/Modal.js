import React from 'react';
import _ from 'underscore';
import styles from '../stylesheets/Modal.less';
import Icon from './Icon';
import $ from 'jquery';
import cx from 'classnames';
import 'bootstrap/js/modal';
import 'bootstrap/js/transition';

var Modal = React.createClass({
  propTypes: {
    open: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOf(['default', 'small', 'large']),
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    children: React.PropTypes.any.isRequired
  },

  getDefaultProps() {
    return {
      static: false,
      onOpen: _.noop,
      onClose: _.noop,
      size: 'default'
    };
  },

  componentDidMount() {
    var $modal = this._getModalElem();

    $modal.modal({
      backdrop: 'static',
      show: false
    });
    if (this.props.open) {
      this._openModal();
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open && !prevProps.open) {
      this._openModal();
    }
  },

  _getModalElem() {
    return $(React.findDOMNode(this.refs.modal));
  },

  _openModal() {
    var $modal = this._getModalElem();

    $modal.modal('show');
    setTimeout(this.props.onOpen,
               $.fn.modal.Constructor.TRANSITION_DURATION);
  },

  _closeModal() {
    var $modal = this._getModalElem();

    $modal.modal('hide');
    setTimeout(this.props.onClose,
               $.fn.modal.Constructor.TRANSITION_DURATION);
  },

  _renderHeader() {
    return (
      <div className="modal-header">
        <button
          className="close"
          ariaLabel="Close"
          onClick={this._closeModal}>
          <span ariaHidden="true">&times;</span>
        </button>

        <h4 className="modal-title">{this.props.title}</h4>
      </div>
    );
  },

  _renderContent() {
    return (
      <div className="modal-body">
          {this.props.children}
      </div>
    );
  },

  _renderFooter() {
    return (
      <div className="modal-footer">
        <button
          className="btn btn-default"
          onClick={this._closeModal}>
            Close
        </button>
      </div>
    );
  },

  render() {
    var {size} = this.props;
    return (
      <div
        ref="modal"
        className="modal fade">
        <div
          className={cx(
            'modal-dialog',
            size === 'small' && 'modal-sm',
            size === 'large' && 'modal-lg'
          )}>
          <div className="modal-content">
            {this._renderHeader()}
            {this._renderContent()}
            {this._renderFooter()}
          </div>
        </div>
      </div>
    );
  }
});

export default Modal;