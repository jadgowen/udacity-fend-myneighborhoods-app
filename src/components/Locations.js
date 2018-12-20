import React, { Component } from 'react'
import LocationInfo from './LocationInfo'

class Locations extends Component {
  render() {
    return (
      <div className="locations">
      {this.props.locationData.map(location =>
        <LocationInfo
          key={location.id}
          {...location}
        />)}
      </div>
    )
  }
}

export default Locations;
