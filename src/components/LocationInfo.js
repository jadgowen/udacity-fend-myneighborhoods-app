import React, { Component } from 'react'


class LocationInfo extends Component {

openInfoWindow = (locationID) => {
  this.props.markers.map(marker => {
    if (marker.id === locationID) {
      window.google.maps.event.trigger(marker, 'click')
    }
    return null
  })
}

highlightMarker = (locationID) => {
  this.props.markers.map(marker => {
    if (marker.id === locationID) {
      window.google.maps.event.trigger(marker, 'mouseover')
    }
    return null
  })
}

unlightMarker = (locationID) => {
  this.props.markers.map(marker => {
    if (marker.id === locationID) {
      window.google.maps.event.trigger(marker, 'mouseout')
    }
    return null
  })
}

  render() {
    return (
        <li
          className="location-info"
          id={this.props.id}
          onClick={() =>
            {
              this.openInfoWindow(this.props.id)
            }
          }
          onMouseOver={() =>
            {
              this.highlightMarker(this.props.id)
            }
          }
          onMouseOut={() =>
            {
              this.unlightMarker(this.props.id)
            }
          }
        >
          {this.props.name}
        </li>
    )
  }
}

export default LocationInfo;