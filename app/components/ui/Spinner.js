import React from 'react'
import Icon from './Icon'

var Spinner = React.createClass({
  render() {
    return <Icon name="circle-o-notch" spin/>;
  }
});

export default Spinner