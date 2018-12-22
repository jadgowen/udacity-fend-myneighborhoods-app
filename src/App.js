import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Map from './components/Map'
import Sidebar from './components/Sidebar'

class App extends Component {

state = {
  map: {},
  locations: [],
  markers: [],
  infowindow: {},
  params: {
    term: '',
    location: 'Tucson',
    limit: 10
  }
}

//Render map and get initial Yelp API data on component load
componentDidMount() {
  this.renderMap()
  setTimeout(
    this.getYelpData()
  ,2500)
}

//Updates parameters based on query in Sidebar component, refreshes Yelp API data based on parameters
updateParams = (query) => {
  this.setState({params: {
    ...this.state.params,
    term: query
  }})
  this.getYelpData(query)
}

renderMap = () => {
  loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA5OueiYMUhhinAKJXkIP1mMCQS12sSt2E&callback=initMap");
  window.initMap = this.initMap;
}

//Fetches Yelp API data and updates markers to reflect new data
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
      locations: response.data.businesses
    },this.makeMarkers)
  })
  .catch(error => {
    console.log("Yelp API Error: " + error)
  })
}

//Function that creates map and sets values to map state
initMap = () => {
  var map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.1930, lng: -110.8215},
    zoom: 12,
    mapTypeControl: false
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

//Marker function inspired by https://stackoverflow.com/questions/22773651/reload-markers-on-googles-maps-api/26408428
makeMarkers = () => {
  let infowindow = new window.google.maps.InfoWindow()
  let locMarkers = []
  const defaultIcon = this.makeMarkerIcon('c29145')
  const hoverIcon = this.makeMarkerIcon('9c9c9c')

  function toggleAnimation(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null)
    } else {
      marker.setAnimation(window.google.maps.Animation.BOUNCE)
      setTimeout(function(){marker.setAnimation(null)}, 500)
    }
  }

  this.state.markers.map(marker => {
    marker.setMap(null)
    return null
  })

  this.state.locations.map(location => {
    let content = `
      <img src="${location.image_url}" height="40px" width="40px">
      <div><a href="${location.url}">${location.name} - ${location.location.address1}</a></div>
    `
    let marker = new window.google.maps.Marker({
      position: {lat: location.coordinates.latitude, lng: location.coordinates.longitude},
      map: this.state.map,
      title: location.name + " - " + location.location.address1,
      animation: window.google.maps.Animation.DROP,
      icon: defaultIcon
    })
    marker.addListener('click', function() {
      infowindow.setContent(content)
      infowindow.open(this, marker)
      toggleAnimation(marker)
    })
    marker.addListener('mouseover', function() {
      this.setIcon(hoverIcon)
    })
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon)
    })
    locMarkers.push(marker)
    this.setState({markers: locMarkers})
    return null
  })
}

  render() {
    return (
      <div className="App">
        <Sidebar
          locationData={this.state.locations}
          updateParams={this.updateParams}
        />
        <Map/>
      </div>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
