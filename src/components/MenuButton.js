import React, { Component } from 'react'

class MenuButton extends Component {
  render() {
    return (
      <button
        className="menuBtn"
        onClick={this.props.toggleSidebar}
        tabIndex="0"
      >
        &#9776;
        <span
          className="menu-text"
        >
          Menu
        </span>
      </button>
    )
  }
}

export default MenuButton;
