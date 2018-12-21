import React, { Component } from 'react'


class LocationInfo extends Component {

  render() {
    return (
      <div className="location-info">
        Name: {this.props.name}
        <div>
          Location: {this.props.location.address1}
        </div>
        <div>
          Rating: {this.props.rating}
        </div>
      </div>
    )
  }
}

export default LocationInfo;
