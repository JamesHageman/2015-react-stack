import React from 'react';
import Modal from './Modal';

var ModalExample = React.createClass({
  getInitialState() {
    return {
      modalOpen: false
    };
  },

  _open() {
    this.setState({
      modalOpen: true
    });
  },

  _modalClose() {
    this.setState({
      modalOpen: false
    });
  },

  render() {
    return (
      <div className="row">
        Modal Example:
        <button className="btn btn-default" onClick={this._open}>Open</button>

        <Modal title="Modal" open={this.state.modalOpen} onClose={this._modalClose}>
          hello modal!
        </Modal>
      </div>
    );
  }
});

export default ModalExample;
