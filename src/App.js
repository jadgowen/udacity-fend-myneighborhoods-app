import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Map from './components/Map'
import Sidebar from './components/Sidebar'

class App extends Component {

state = {
  locations: [],
  params: {
    term: '',
    location: 'Tucson'
  }
}

componentDidMount() {
  this.getYelpData()
  this.renderMap()
}

updateParams = (query) => {
  this.setState({params: {
    ...this.state.params,
    term: query
  }})
  this.getYelpData()
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
      })
    })
    .catch(error => {
      console.log("Error: " + error)
    })
}

initMap = () => {
      var map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: 32.1930, lng: -110.8215},
        zoom: 12
      })

      var infowindow = new window.google.maps.InfoWindow()




  this.state.locations.map(location => {
    var content = `
      <img src="${location.image_url}" height="40px" width="40px">
      <div><a href="${location.url}">${location.name} - ${location.location.address1}</a></div>
    `
    var marker = new window.google.maps.Marker({
      position: {lat: location.coordinates.latitude, lng: location.coordinates.longitude},
      map: map,
      title: location.name + " - " + location.location.address1
    })



    marker.addListener('click', function() {
      infowindow.setContent(content)
    infowindow.open(map, marker);
  })
  })
}

  render() {
    return (
      <div className="App">
        <Sidebar
          locationData={this.state.locations}
          getYelpData={this.getYelpData}
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
