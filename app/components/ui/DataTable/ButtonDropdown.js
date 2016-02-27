import React from 'react';
import _ from 'underscore';
import cx from 'classnames';
import 'bootstrap/js/dropdown';

import ModalDropdown from './ModalDropdown';
import Tooltip from './Tooltip';

/*

Wraps a <Button/> to add Bootstrap button functionality

Usage:

import {ButtonDropdown, DropdownSeparator} from './ButtonDropdown';

<ButtonDropdown

  (any Button props)
  adaptStyle="primary"
  adaptSize="large"
  className={styles.whatever}

  (dropdown props)
  split={bool} // Separate button from dropdown toggle

  // function returning an array of components (usually anchor tags)
  renderList={() => ([
    <a href="">item 1</a>,
    <a href="">item 2</a>,
    <DropdownSeparator/>,
    <a href="">item 3</a>
  ])}>

  // All children are passed to a <Button/>

  My Dropdown

</ButtonDropdown>

 */

export const DropdownSeparator = React.createClass({
  render: () => (<span/>)
});

export const ButtonDropdown = React.createClass({
  propTypes: {
    renderList: React.PropTypes.func.isRequired,
    split: React.PropTypes.bool,
    right: React.PropTypes.bool,
    caret: React.PropTypes.bool,
    wrapperClassName: React.PropTypes.string,
    closeOnClick: React.PropTypes.bool
  },

  getDefaultProps: () => ({
    split: false,
    right: false,
    caret: true,
    wrapperClassName: '',
    closeOnClick: false
  }),

  getInitialState() {
    return {
      open: false,
      x: null,
      y: null
    };
  },

  _close() {
    this.setState({
      open: false
    });
  },

  _toggle(e) {
    var x;
    var y;

    if (e.changedTouches) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    e.preventDefault();
    e.stopPropagation();

    this.setState({
      open: !this.state.open,
      x: x,
      y: y
    });
  },

  _handleListClick(e) {
    e.stopPropagation();
  },

  _renderButtonChild() {
    var {split, className} = this.props;
    var buttonProps = _.omit(this.props,
                             'renderList',
                             'split',
                             'children',
                             'className');

    if (!split) {
      buttonProps.onClick = this._toggle;
      buttonProps.className = cx(className);
    } else {
      buttonProps.className = cx(className);
    }

    return (
      <button ref="button" {...buttonProps} className="btn btn-default"
        focused={this.state.open && !split}>
        { this.props.children }
        { ' ' }
        { (!split && this.props.caret) &&
          <span className="caret"/>
        }
      </button>
    );
  },

  _createListItem(item, i) {
    if (item.type === DropdownSeparator) {
      return <li key={i} role="separator" className="divider"></li>;
    }

    return <li key={i}>{item}</li>;
  },

  _renderSplitDropdown() {
    return (
      // adaptStyle={this.props.adaptStyle}
      // adaptSize={this.props.adaptSize}

      <button
        ref="splitDropdown"
        className="btn btn-default"
        onClick={this._toggle}
        focused={this.state.open}>
        <span className="caret"></span>
        <span className="sr-only">Toggle Dropdown</span>
      </button>
    );
  },

  _renderDropdownList() {
    var list = this.props.renderList();

    return (
      <ul ref="list" className={cx(
        'dropdown-menu',
        this.props.right && 'dropdown-menu-right'
      )} style={{
        display: this.state.open ? 'block' : 'none'
      }}>
        { list.map(this._createListItem) }
        <li>
          <a role="button" onClick={this._close}>
            Close
            <span className="close pull-right">
              &times;
            </span>
          </a>
        </li>
      </ul>
    );
  },

  render() {
    var {split} = this.props;
    var xOffset = this.props.right ? 5 : -5;
    var yOffset = 5;


    return (
      <span className={this.props.wrapperClassName}>
        <Tooltip
          content={this.props.tooltipContent}
          placement={this.props.tooltipPlacement}>
          <div className="btn-group">
            { this._renderButtonChild() }
            { split &&
              this._renderSplitDropdown()
            }
          </div>
        </Tooltip>

        { this.state.open ?
          <ModalDropdown
            x={this.state.x + xOffset}
            y={this.state.y + yOffset}
            widthOffset={10}
            heightOffset={0}
            overlayBackground="transparent"
            onRequestClose={this._close}
            closeOnClick={this.props.closeOnClick}>
            { this._renderDropdownList() }
          </ModalDropdown>
          : <span/>
        }
      </span>
    );
  }
});
