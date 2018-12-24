## MyNeighborhoods App Project

## Table of Contents
 - [Overview](#Overview)
 - [Project Requirements](#Project-Requirements)
 - [Downloading/Running the Project](#DownloadingRunning-the-Project)
 - [Dependencies](#Dependencies)
 - [APIs](#APIs)
 - [Thanks!](#Thanks)

## Overview
This SPA(single page application) is designed to show businesses from my home town of Tucson, Arizona, US. Within the SPA you are able to search for businesses, filter the results of that search, and access additional information while mapping them across the selected area.


## Project Requirements
A list of project requirements from Udacity can be accessed [here](https://review.udacity.com/#!/rubrics/1351/view).
### Highlights:
  - The project is a single page application
  - The project must use a Google Maps API
  - The project must get information from a third-party API
  - The information must be filterable
  - The information must be plotted on the Map and show additional info when a marker is clicked
  - The project must use a service worker
  - The project must have ARIA ally attributes

## Downloading/Running the Project
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can clone the git repo and run it in development mode locally:
```
$ git clone https://github.com/jadgowen/udacity-fend-myneighborhoods-app
$ npm install
$ npm install axios -s
$ npm start
```
The development mode can now be accessed at [http://localhost:3000](http://localhost:3000)

To view the project in production (verify service worker is active), you can:
```
$ npm run build
$ serve -s build
```
The production environment will be accessible at [http://localhost:5000](http://localhost:5000)

## Dependencies
The project uses html, css, and js functionality contained within the [Create React App](https://github.com/facebook/create-react-app) container. It also uses [axios](https://www.npmjs.com/package/axios) to manage the headers sent to the Yelp API.

## APIs
This project uses the Google Maps API and Yelp API to meet the project requirements for information fetching and visualization.

## Thanks!
Quite possibly the most challenging project in the FEND course, it makes sense that it would be the final project. I wanted to thank the kind people at [Udacity](https://www.udacity.com/), the student resources, and contributors at sites like [W3 Schools](https://www.w3schools.com/) and [StackOverflow](https://stackoverflow.com/). I will never cease to be amazed at how talented and knowledgeable people are. I certainly wouldn't have been able to complete this project without them!
