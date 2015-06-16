import React from 'react';
import {Link, State as StateMixin} from 'react-router';
import styles from '../stylesheets/NavList.less';
import cx from 'classnames';
import Icon from './Icon';

var {arrayOf, shape, string, bool, any} = React.PropTypes;

var NavList = React.createClass({

  mixins: [ StateMixin ],

  propTypes: {
    items: arrayOf(
      shape({
        title: string,
        link: string,
        route: bool,
        params: any,
        query: any
      })
    )
  },

  getInitialState() {
    return {
      collapse: true
    };
  },

  _toggleDropdown() {
    this.setState({
      collapse: !this.state.collapse
    });
  },

  _collapse() {
    this.setState({
      collapse: true
    });
  },

  _renderList() {
    var items = this.props.items;

    return items.map((item) => {
      var active = this.isActive(item.link, item.params, item.query);

      var sharedProps = {
        target: item.target,
        className: cx(
          styles.link,
          this.state.collapse && styles.collapse
        ),
        onClick: this._collapse
      };

      var liClassName = cx(active && 'active');

      var content = (
        <div className={styles.linkBox}>
          {item.title}
        </div>
      );

      if (item.route || item.route === undefined) {
        return (
          <li className={liClassName} key={item.title}>
            <Link to={item.link} params={item.params} {...sharedProps}>
              {content}
            </Link>
          </li>
        );
      } else {
        return (
          <li className={liClassName} key={item.title}>
            <a href={item.link} {...sharedProps}>{content}</a>
          </li>
        );
      }
    });
  },

  render() {
    var iconName = (this.state.collapse) ? 'chevron-right' : 'chevron-down';

    return (
      <div>
        <button
          className={cx('btn btn-default', styles.dropdownToggle)}
          onClick={this._toggleDropdown}>
          <Icon name={iconName} />
        </button>
        <ul className="nav nav-pills nav-stacked">
          {
            this._renderList()
          }
        </ul>
      </div>
    );
  }
});

export default NavList;
