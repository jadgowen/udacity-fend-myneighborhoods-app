import React, { Component } from 'react'
import Locations from './Locations'

class Sidebar extends Component {

  state = {
    query:"",
    filter:""
  }

  updateQuery = (query) => {
    this.setState({ query })
  }

  updateFilter = (filter) => {
    this.setState({ filter })
  }

  queryLocations = (e) => {
    this.props.updateParams(this.state.query)
    e.preventDefault()
  }

  filterLocations = (e) => {
    this.props.filterResults(this.state.filter)
    e.preventDefault()
  }

  render() {
    return (
      <div className="sidebar" id="sidebar">
        <form
          onSubmit={this.queryLocations}
          className="searchForm"
        >
          <input
            type="search"
            placeholder="Conduct New Search"
            id="search"
            value={this.state.query}
            onChange={(e) => this.updateQuery(e.target.value)}
          />
          <input
            type="submit"
            value="Search"
            id="search"
          />
        </form>
        <form
          onSubmit={this.filterLocations}
          className="searchForm"
        >
          <input
            type="search"
            placeholder="Filter Results"
            id="filter"
            value={this.state.filter}
            onChange={(e) => this.updateFilter(e.target.value)}
          />
          <input
            type="submit"
            value="Filter"
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
