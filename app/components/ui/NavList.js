import React from 'react'
import {Link} from 'react-router'
import styles from '../stylesheets/NavList.css'
import Box from '../ui/Box'

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

  render() {
    var {items} = this.props;
    return (
      <Box padding={false} column>
        {
          items.map((item) => {
            var sharedProps = {
              key: item.title,
              target: item.target,
              className: styles.link
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
        }
      </Box>
    )
  }
});

export default NavList
