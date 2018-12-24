import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import MenuButton from './components/MenuButton'

class App extends Component {

  state = {
    // Objects to store map and infowindow data
    map: {},
    infowindow: {},
    // Master states to contain data from Yelp API
    locations: [],
    markers: [],
    // Parameters sent to Yelp API
    params: {
      term: '',
      location: 'Tucson 85711',
      limit: 10,
      radius: 5000
    },
    // Location and marker containers modifiable by filter
    filter: '',
    visibleLocations: [],
    hiddenMarkers: []
  }

  // Render map and get initial Yelp API data on component load
  componentDidMount() {
    this.renderMap()
    this.getYelpData()
  }

  // Updates parameters based on query in Sidebar component, refreshes Yelp API data based on parameters
  updateParams = (query) => {
    this.setState({params: {
      ...this.state.params,
      term: query
    }})
    this.getYelpData(query)
  }

  // Filters existing results
  filterResults = (filter) => {
    // Pass value from Sidebar component to filter state
    this.setState({ filter })
    let visibleLocations
    let hiddenMarkers
    // Convert filter string to RegExp for .match function
    let regFilter = new RegExp(filter, 'i')

    if (filter) {
      // Populate visibleLocations with filtered locations
      visibleLocations = this.state.locations
        .filter(location => location.name.match(regFilter))
      this.setState({ visibleLocations })
      // Populate hiddenMarkers with filtered markers
      hiddenMarkers = this.state.markers
        .filter(marker => visibleLocations.every(location => location.id !== marker.id))
      hiddenMarkers.map(marker => marker.setVisible(false))
      this.setState({hiddenMarkers})
    // If no filter, reset visibleLocations, make all markers visible, clear hiddenMarkers
    } else {
      this.setState({ visibleLocations: this.state.locations })
      this.state.markers.map(marker => marker.setVisible(true))
      this.setState({ hiddenMarkers: [] })
      console.log("There's no filter!")
    }
  }

  removeFilter = () => {
    this.setState({ filter: '' })
    this.setState({ visibleLocations: this.state.locations })
    this.state.markers.map(marker => marker.setVisible(true))
    this.setState({ hiddenMarkers: [] })
    console.log("Filter has been removed!")
  }

  // Attaches the Google API script tag to index.html, allows for initMap callback to reference properly
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA5OueiYMUhhinAKJXkIP1mMCQS12sSt2E&callback=initMap");
    window.initMap = this.initMap;
  }

  //Fetches Yelp API data and updates markers to reflect new data after setting state
  getYelpData = (params) => {
    //Used cors-anywhere.herokuapp.com to overcome Yelp API CORS issue per https://knowledge.udacity.com/questions/715
    const endPoint = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?"
    axios.get(endPoint,
      {
        headers: {Authorization: 'Bearer mEHt0gHLdWBAvEvYv8XF34KHmp01kEzmUhdQf2K93V37AQ3R8ATUEu8sxphg-frT5-gCStvSz22RGaLTsNSxOp4Z_Dq5cnPQzCuH86gl4LI5loMzW31EJchpRa4WXHYx'},
        params: {
          ...this.state.params,
          term: params
        }
      }
    )
    .then(response => {
      this.setState({
        locations: response.data.businesses,
        visibleLocations: response.data.businesses
      },this.makeMarkers)
    })
    .catch(error => {
      console.log("Yelp API Error: " + error)
    })
  }

  //Function that creates map and sets values to map state
  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.21945, lng: -110.86548},
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    })
    this.setState({map: map})
  }

  makeMarkerIcon = (markerColor) => {
    let markerImage = {
      url:'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1|345|'+ markerColor +
      '|40|_|%E2%80%A2',
      size: new window.google.maps.Size(50,50),
      origin: new window.google.maps.Point(0,0),
      anchor: new window.google.maps.Point(10,34),
      scaledSize: new window.google.maps.Size(30,50)
    }
    return markerImage;
  }

  // Marker function inspired by https://stackoverflow.com/questions/22773651/reload-markers-on-googles-maps-api/26408428
  makeMarkers = () => {
    let infowindow = new window.google.maps.InfoWindow()
    let locMarkers = []
    const defaultIcon = this.makeMarkerIcon('197021')
    const hoverIcon = this.makeMarkerIcon('e61919')

    // Adds BOUNCE animation to marker on click
    function toggleAnimation(marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null)
      } else {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function(){marker.setAnimation(null)}, 500)
      }
    }
    // Remove existing markers
    this.state.markers.map(marker => {
      marker.setMap(null)
      return null
    })

    // Mapping over locations to create InfoWindow and Marker data
    this.state.locations.map(location => {
      // String used to populate InfoWindow
      let content = `
        <img src="${location.image_url}" class="thumbnail" alt="Picture of ${location.name}">
        <div><a href="${location.url}">${location.name} - ${location.location.address1}</a></div>
        <div>Rating:${location.rating}</div>
        <div>Data provided by <a href="https://www.yelp.com">Yelp!</a></div>
      `
      // Marker values created location
      let marker = new window.google.maps.Marker({
        position: {lat: location.coordinates.latitude, lng: location.coordinates.longitude},
        map: this.state.map,
        title: location.name + " - " + location.location.address1,
        animation: window.google.maps.Animation.DROP,
        icon: defaultIcon,
        id: location.id
      })
      // Event opens InfoWindow and executes animation
      marker.addListener('click', function() {
        infowindow.setContent(content)
        infowindow.open(this, marker)
        toggleAnimation(marker)
      })
      // Event changes icon color and highlights corresponding list item
      marker.addListener('mouseover', function() {
        this.setIcon(hoverIcon)
        document.getElementById(location.id).setAttribute('style','text-decoration: underline; font-weight: bold; color: #2396cf;')
      })
      // Event reverts icon color and unhighlights corresponding list item
      marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon)
        document.getElementById(location.id).removeAttribute('style','text-decoration: underline; font-weight: bold; color: #2396cf;')
      })
      // Pushes marker data into locMarkers array
      locMarkers.push(marker)
      // Sets markers state to locMarkers array
      this.setState({markers: locMarkers})
      return null
    })
  }

  // Show/hide sidebar
  toggleSidebar = () => {
    if(document.getElementById('sidebar').style.display !== 'block') {
      document.getElementById('sidebar').style.display = 'block'
    } else {
      document.getElementById('sidebar').style.display = 'none'
    }
  }

  render() {
    return (
      <div className="App">
        <MenuButton
          toggleSidebar={this.toggleSidebar}
        />
        <Sidebar
          locationData={this.state.visibleLocations}
          markers={this.state.markers}
          updateParams={this.updateParams}
          makeMarkers={this.makeMarkers}
          filterResults={this.filterResults}
          removeFilter={this.removeFilter}
        />
        <Map/>
      </div>
    );
  }
}

// Appends Google API script to index.html
function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
