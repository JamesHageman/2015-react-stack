import AltContainer from 'alt/AltContainer'
import React from 'react'


/*

A decorator for smart components in /components/containers/

Usage:

@connect({
  stores: {
    UserStore,
    WhateverStore
  }
})
class MySmartComponent extends React.Component {
  render() {
    // do something with this.props.UserStore, this.props.WhateverStore
  }
}

Anything you pass connect will be passed to AltContainer.
See documentation here:

https://github.com/goatslacker/alt/blob/master/components/AltContainer.js

 */
export default function connect(altContainerOptions) {
  return (Component) => {
    var ConnectToStores = React.createClass({
      displayName: `Connect(${Component.name})`,
      render() {
        return (
          <AltContainer {...altContainerOptions}>
            <Component {...this.props}/>
          </AltContainer>
        );
      }
    });

    return ConnectToStores;
  }
}
