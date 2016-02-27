import React from 'react';
import {Column} from 'fixed-data-table';
import PersistStateMixin from './PersistStateMixin';
import PureRenderMixin from 'react-pure-render/mixin';

var SimpleTable = React.createClass({
  propTypes: {
    pageLength: React.PropTypes.number,
    children: React.PropTypes.node,

    headerHeight: React.PropTypes.number.isRequired,
    rowGetter: React.PropTypes.func.isRequired,

    // optional DataGrid properties
    rowHeight: React.PropTypes.number,
    rowHeightGetter: React.PropTypes.func,
    onRowClick: React.PropTypes.func,
    rowsCount: React.PropTypes.number,
    rowClassNameGetter: React.PropTypes.func
  },

  mixins: [PersistStateMixin, PureRenderMixin],

  getDefaultProps() {
    return {
      pageLength: 10
    };
  },

  getInitialState() {
    return {
      // One-based page index
      pageIndex: 1,
      ...this.getPersistedState()
    };
  },

  componentWillUpdate(nextProps, nextState) {
    if ((nextState.pageIndex - 1) * nextProps.pageLength >
        nextProps.rowsCount) {
      this.setState({
        pageIndex: Math.ceil(nextProps.rowsCount / nextProps.pageLength)
      });
    }
  },

  _handlePageChange(i) {
    this.setState({
      pageIndex: i
    });
  },

  _getColumns() {
    var columns = [];
    function search(children) {
      React.Children.forEach(children, child => {
        if (!child) {
          return;
        }

        if (child.type === Column) {
          if (child.props.fixed) {
            columns = [child, ...columns];
          } else {
            columns.push(child);
          }
        } else {
          search(child.props.children);
        }
      });
    }

    search(this.props.children);

    return columns;
  },

  _renderHeaders(columns) {
    return columns.map(col => {
      var fn = col.props.headerRenderer || this._defaultCellRenderer;
      var child = fn(col.props.label, col.props.dataKey);
      return <th
        className={'public_fixedDataTableCell_wrap3'}
        key={col.props.dataKey}
        style={{
          width: col.props.width + 'px',
          height: this.props.headerHeight + 'px',
          tableLayout: 'fixed',
          overflow: 'hidden'
        }}>
          { child &&
            React.cloneElement(child, {
              className: child.props.className +
                ' public_fixedDataTableCell_cellContent'
            })
          }
      </th>;
    });
  },

  _defaultCellRenderer(cell) {
    return <div>
      {cell}
    </div>;
  },

  _rowHeightGetter(i) {
    if (this.props.rowHeightGetter) {
      return this.props.rowHeightGetter(i);
    }

    return this.props.rowHeight;
  },

  _renderCell(i, row, col) {
    var {dataKey} = col.props;
    var cellData = col.props.cellDataGetter(dataKey, row);
    var fn = col.props.cellRenderer || this._defaultCellRenderer;
    var child = fn(cellData, dataKey, row, i, null, col.props.width);
    var type = typeof child;
    if (type === 'string' || type === 'number') {
      child = <div>{child}</div>;
    }

    return <td
      className="public_fixedDataTableCell_wrap3"
      key={col.props.dataKey}
      style={{
        width: col.props.width + 'px',
        height: this._rowHeightGetter(i) + 'px',
        tableLayout: 'fixed',
        overflow: 'hidden',
        position: 'relative'
      }}>
        { child &&
          React.cloneElement(child, {
            className: child.props.className +
              ' public_fixedDataTableCell_cellContent'
          })
        }
    </td>;
  },

  _rowClick(i, row, e) {
    this.props.onRowClick(e, i, row);
  },

  _renderRows(columns) {
    var rows = [];
    var len = this.props.pageLength;
    var start = (this.state.pageIndex - 1) * (len);
    var end = Math.min(start + len, this.props.rowsCount);

    for (let i = start; i < end; i++) {
      const row = this.props.rowGetter(i);
      rows.push(
        <tr
          key={i}
          className={this.props.rowClassNameGetter(i)}
          onClick={this._rowClick.bind(this, i, row)}>
          {
            columns.map(this._renderCell.bind(this, i, row))
          }
        </tr>
      );
    }

    return rows;
  },

  _renderPagination() {
    var pages = [];
    var currPage = 1;
    var lastPage;
    var finalPages = [];
    for (let i = 0; i < this.props.rowsCount; i += this.props.pageLength) {
      pages.push(currPage);
      currPage++;
    }

    lastPage = pages[pages.length - 1];

    pages = pages.filter(page => {
      if (page <= 2 || page >= lastPage - 1) {
        return true;
      }

      if (Math.abs(page - this.state.pageIndex) <= 1) {
        return true;
      }

      return false;
    });

    // add ellipses
    for (let i = 0, n = pages.length; i < n - 1; i++) {
      finalPages.push(pages[i]);
      if (pages[i + 1] - pages[i] > 1) {
        finalPages.push(null);
      }
    }

    finalPages.push(pages[pages.length - 1]);

    return <nav>
      <ul className="pagination">
        <li
          className={
            this.state.pageIndex === 1 ?
            'disabled' : ''
          }
          onClick={this.state.pageIndex !== 1 ?
            this._handlePageChange.bind(this, this.state.pageIndex - 1)
            : null
          }>
          <a role="button" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {
          finalPages.map((i, n) => {
            if (i === null) {
              return <li key={'...' + n} className="disabled">
                <a role="button">
                  ...
                </a>
              </li>;
            }

            return <li
              key={i}
              className={i === this.state.pageIndex ? 'active' : ''}
              onClick={this._handlePageChange.bind(this, i)}>
              <a role="button">{i}</a>
            </li>;
          })
        }
        <li
          className={
            this.state.pageIndex === pages[pages.length - 1] ?
            'disabled' : ''
          }
          onClick={this.state.pageIndex !== pages[pages.length - 1] ?
            this._handlePageChange.bind(this, this.state.pageIndex + 1)
            : null
          }>
          <a role="button" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>;
  },

  render() {
    var columns = this._getColumns();
    var fullWidth = columns.reduce((acc, curr) => {
      return acc + curr.props.width;
    }, 0);

    return <div>
      <div style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <table style={{
          width: fullWidth + 'px',
          tableLayout: 'fixed'
        }}>
          <thead className="public_fixedDataTable_header">
            <tr>
              {this._renderHeaders(columns)}
            </tr>
          </thead>
          <tbody>
            {this._renderRows(columns)}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: '0px 10px'
      }}>
          { this.props.rowsCount > this.props.pageLength &&
            this._renderPagination()
          }
      </div>
    </div>;
  }
});

export default SimpleTable;
