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
          className="form"
        >
          <input
            type="search"
            placeholder="Conduct New Search"
            id="search-field"
            aria-label="search text field"
            value={this.state.query}
            className="search"
            onChange={(e) => this.updateQuery(e.target.value)}
          />
          <input
            type="submit"
            value="Search"
            id="search-button"
            aria-label="search button"
            htmlFor="search text field"
            className="search"
          />
        </form>
        <form
          onSubmit={this.filterLocations}
          className="form"
        >
          <input
            type="search"
            placeholder="Filter Results"
            id="filter-field"
            aria-label="filter text field"
            value={this.state.filter}
            className="filter"
            onChange={(e) => this.updateFilter(e.target.value)}
          />
          <input
            type="submit"
            value="Filter"
            id="filter-button"
            aria-label="filter button"
            htmlFor="filter text field"
          />
          <input
            type="button"
            id="no-filter-button"
            aria-label="remove filter button"
            htmlFor="filter text field"
            value="Unfilter"
            onClick={this.props.removeFilter}
          />
        </form>
        <Locations
          locationData={this.props.locationData}
          makeMarkers={this.props.makeMarkers}
          markers={this.props.markers}
        />
        <div className="footer">
          Made by Joe Gowen for Udacity FEND Nanodegree.
          This MyNeighborhoods App uses 3rd-party data from the <a href="https://www.yelp.com/developers" aria-label="Yelp API Developer Link" tabIndex="-1">Yelp API</a>.
        </div>
      </div>
    )
  }
}

export default Sidebar;
