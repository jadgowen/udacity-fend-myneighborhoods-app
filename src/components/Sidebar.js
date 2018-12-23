import React, { Component } from 'react'
import Locations from './Locations'

class Sidebar extends Component {

  state = {
    query:""
  }

  updateQuery = (query) => {
    this.setState({ query })
  }

  filterLocations = (e) => {
    this.props.updateParams(this.state.query)
    e.preventDefault()
  }

  render() {
    return (
      <div className="sidebar">
        <form
          onSubmit={this.filterLocations}
          className="searchForm"
        >
          <input
            type="search"
            placeholder="search"
            id="search"
            value={this.state.query}
            onChange={(e) => this.updateQuery(e.target.value)}
          />
          <input
            type="submit"
            value="Search"
            id="filter"
          />
        </form>
        <Locations
          locationData={this.props.locationData}
          makeMarkers={this.props.makeMarkers}
          markers={this.props.markers}
        />
      </div>
    )
  }
}

export default Sidebar;
