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
    location: 'Tucson'
  }
}

componentDidMount() {
  this.renderMap()
  this.getYelpData()
}

updateParams = (query) => {
  this.setState({params: {
    ...this.state.params,
    term: query
  }},this.getYelpData())
}

renderMap = () => {
  loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyA5OueiYMUhhinAKJXkIP1mMCQS12sSt2E&callback=initMap");
  window.initMap = this.initMap;
}

getYelpData = () => {
  //Used cors-anywhere.herokuapp.com to overcome Yelp API CORS issue per https://knowledge.udacity.com/questions/715
  const endPoint = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?"
  axios.get(endPoint,
    {
      headers: {Authorization: 'Bearer mEHt0gHLdWBAvEvYv8XF34KHmp01kEzmUhdQf2K93V37AQ3R8ATUEu8sxphg-frT5-gCStvSz22RGaLTsNSxOp4Z_Dq5cnPQzCuH86gl4LI5loMzW31EJchpRa4WXHYx'},
      params: this.state.params
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

initMap = () => {
      var map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.1930, lng: -110.8215},
        zoom: 13,
        mapTypeControl: false
      })
      this.setState({map: map})
}

makeMarkers = () => {
  let infowindow = new window.google.maps.InfoWindow()
  let locMarkers = []
  this.state.markers.map(marker => {
    marker.setMap(null)
    return marker
  })
  this.state.locations.map(location => {
    var content = `
      <img src="${location.image_url}" height="40px" width="40px">
      <div><a href="${location.url}">${location.name} - ${location.location.address1}</a></div>
    `
    var marker = new window.google.maps.Marker({
      position: {lat: location.coordinates.latitude, lng: location.coordinates.longitude},
      map: this.state.map,
      title: location.name + " - " + location.location.address1,
      animation: window.google.maps.Animation.DROP
    })
    locMarkers.push(marker)
    marker.addListener('click', function() {
      infowindow.setContent(content)
      infowindow.open(this, marker);
    })
    this.setState({markers: locMarkers})
    return locMarkers
  })
}

  render() {
    return (
      <div className="App">
        <Sidebar
          locationData={this.state.locations}
          updateParams={this.updateParams}
          makeMarkers={this.makeMarkers}
          getYelpData={this.getYelpData}
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
