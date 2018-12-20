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
    e.preventDefault();
  }

  render() {
    return (
      <div className="sidebar">
        <form onSubmit={this.filterLocations}>
          <input
            type="search"
            placeholder="search"
            id="search"
            value={this.state.query}
            onChange={(e) => this.updateQuery(e.target.value)}
          />
          <input
            type="submit"
            value="Filter"
            id="filter"
          />
        </form>
        <Locations
          locationData={this.props.locationData}
        />
      </div>
    )
  }
}

export default Sidebar;
