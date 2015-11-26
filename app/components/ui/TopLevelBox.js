import React from 'react';
import styles from '../stylesheets/TopLevelBox.less';
import cx from 'classnames';

var TopLevelBox = React.createClass({
  propTypes: {
    children: React.PropTypes.node
  },
  render() {
    return (
      <div className={cx('container', styles.base)}>
        {this.props.children}
      </div>
    );
  }
});

export default TopLevelBox;
