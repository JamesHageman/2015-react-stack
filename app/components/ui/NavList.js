import React from 'react'
import {Link} from 'react-router'
import styles from '../stylesheets/NavList.css'
import Box from '../ui/Box'
import cx from 'classnames'
import Icon from './Icon'

var {arrayOf, shape, string, bool} = React.PropTypes;

var NavList = React.createClass({
  propTypes: {
    items: arrayOf(
      shape({
        title: string,
        link: string,
        route: bool
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
    var {items} = this.props;
    return items.map((item) => {
      var sharedProps = {
        key: item.title,
        target: item.target,
        className: cx(
          styles.link,
          this.state.collapse && styles.collapse
        ),
        onClick: this._collapse
      };

      var content = (
        <Box className={styles.linkBox}>
          {item.title}
        </Box>
      );

      if (item.route || item.route === undefined) {
        return <Link to={item.link} {...sharedProps}>{content}</Link>
      } else {
        return <a href={item.link} {...sharedProps}>{content}</a>
      }
    })
  },

  render() {
    var iconName = (this.state.collapse) ? 'chevron-right' : 'chevron-down';

    return (
      <Box padding={false} column>
        <Box className={styles.dropdownToggle} onClick={this._toggleDropdown}>
          <Icon name={iconName} />
        </Box>
        {
          this._renderList()
        }
      </Box>
    )
  }
});

export default NavList
