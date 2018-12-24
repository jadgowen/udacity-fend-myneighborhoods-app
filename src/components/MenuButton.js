import React, { Component } from 'react'

class MenuButton extends Component {
  render() {
    return (
      <div
        className="menuBtn"
        onClick={this.props.toggleSidebar}
      >
        &#9776;
        <span class="menu-text">
          Menu
        </span>
      </div>
    )
  }
}

export default MenuButton;
