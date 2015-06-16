import React, {Component} from 'react';
import {RouteHandler} from 'react-router';

class MainSection extends Component {
  render() {
    return (
      <div className="col-md-9 col-sm-12">
        <RouteHandler {...this.props}/>
      </div>
    );
  }
}

export default MainSection;
