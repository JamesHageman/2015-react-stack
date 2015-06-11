import React from 'react'
import styles from '../stylesheets/TopLevelBox.css'

var TopLevelBox = React.createClass({
  render() {
    return (
      <div className={styles.base}>
        {this.props.children}
      </div>
    );
  }
});

export default TopLevelBox
