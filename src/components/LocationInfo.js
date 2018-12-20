import React, { Component } from 'react'


class LocationInfo extends Component {

  render() {
    return (
      <li>
        Name: {this.props.name}
        <li>
          Location: {this.props.location.address1}
        </li>
        <li>
          Rating: {this.props.rating}
        </li>
      </li>
    )
  }
}

export default LocationInfo;
