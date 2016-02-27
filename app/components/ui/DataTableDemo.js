import React from 'react';
import getMockData from '../mockData';
import { Table, GroupableDataTable, Column, renderTruncate } from './DataTable';

const DataTableDemo = React.createClass({
  getInitialState() {
    return {
      simple: false,
      grouping: false
    };
  },

  _renderTable() {
    const {grouping} = this.state;
    const data = getMockData();

    // decide at runtime whether to use the standard Table component or
    // the extended GroupableDataTable component.
    const TableComponent = grouping ? GroupableDataTable : Table;

    return <TableComponent
      simple={this.state.simple}
      rowHeight={40}
      data={data}
      rowDataKey="_id"
      headerHeight={50}
      width={800}
      height={600}
      defaultSortBy="name"
      defaultSortDirection="DESC"
      title="My DataTable"
      renderFormControls={() =>
        <div className="form-group">
          <button className="btn btn-primary">Action</button>
        </div>
      }
      persistStateKey={'demoTable' + grouping ? ' (grouped)' : ''}>
      <Column
        required
        dataKey="name"
        width={150}
        label="Name"/>
      <Column
        dataKey="company"
        groupable
        label="Company"
        width={100}/>
      <Column
        dataKey="email"
        label="Email"
        width={200}/>
      <Column
        dataKey="phone"
        label="Phone"
        width={150}/>
      <Column
        dataKey="about"
        label="About"
        width={200}
        cellRenderer={renderTruncate}/>
    </TableComponent>;
  },

  render() {
    return <div>
      <div className="row">
        <div className="col-md-6">
          <h2>DataTable Demo</h2>
        </div>
        <div className="col-md-6">
          <label>
            <input type="checkbox" checked={this.state.simple}
              onChange={e => this.setState({
                simple: e.target.checked
              })}/>
            Simple Mode (Pagination)
          </label>
          <label>
            <input type="checkbox" checked={this.state.grouping}
              onChange={e => this.setState({
                grouping: e.target.checked
              })}/>
            Grouping
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {this._renderTable()}
        </div>
      </div>
    </div>;
  }
});

export default DataTableDemo;
