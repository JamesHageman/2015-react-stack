import React, {Component} from 'react';
import DataTableDemo from '../ui/DataTableDemo';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">Home Page</div>
        </div>
        <DataTableDemo/>
      </div>
    );
  }
}

export default Home;
