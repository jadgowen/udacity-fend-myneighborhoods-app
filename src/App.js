import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import MenuButton from './components/MenuButton'

class App extends Component {

state = {
  map: {},
  locations: [],
  markers: [],
  infowindow: {},
  // Parameters sent to Yelp API
  params: {
    term: '',
    location: 'Tucson 85711',
    limit: 10,
    radius: 5000
  }
}

//Render map and get initial Yelp API data on component load
componentDidMount() {
  this.renderMap()
  this.getYelpData()
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

//Marker function inspired by https://stackoverflow.com/questions/22773651/reload-markers-on-googles-maps-api/26408428
makeMarkers = () => {
  let infowindow = new window.google.maps.InfoWindow()
  let locMarkers = []
  const defaultIcon = this.makeMarkerIcon('197021')
  const hoverIcon = this.makeMarkerIcon('e61919')

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
      <img src="${location.image_url}" class="thumbnail">
      <div><a href="${location.url}">${location.name} - ${location.location.address1}</a></div>
      <div>Rating:${location.rating}</div>
    `
    let marker = new window.google.maps.Marker({
      position: {lat: location.coordinates.latitude, lng: location.coordinates.longitude},
      map: this.state.map,
      title: location.name + " - " + location.location.address1,
      animation: window.google.maps.Animation.DROP,
      icon: defaultIcon,
      id: location.id
    })
    marker.addListener('click', function() {
      infowindow.setContent(content)
      infowindow.open(this, marker)
      toggleAnimation(marker)
    })
    marker.addListener('mouseover', function() {
      this.setIcon(hoverIcon)
      document.getElementById(location.id).setAttribute('style','text-decoration: underline; font-weight: bold; color: #2396cf;')
    })
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon)
      document.getElementById(location.id).removeAttribute('style','text-decoration: underline; font-weight: bold; color: #2396cf;')
    })
    locMarkers.push(marker)
    this.setState({markers: locMarkers})
    return null
  })
}

// Show/hide sidebar
/*
toggleSidebar = () => {
  if(document.getElementById('sidebar').style.width !== '25%') {
    document.getElementById('sidebar').style.width = '25%'
  } else {
    document.getElementById('sidebar').style.width= '0'
  }
}
*/

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
          locationData={this.state.locations}
          markers={this.state.markers}
          updateParams={this.updateParams}
          makeMarkers={this.makeMarkers}
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
