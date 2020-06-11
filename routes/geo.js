const express = require('express');
const fs = require('fs');

const router = express.Router();

// Load files

let statesList = [];
let citiesList = [];
let citiesData = {};

function loadData() {
  fs.readFile('db/states.json', 'utf-8', function (error, data) {
    if (error) {
      console.error(error);
      throw new Error('Unable to load file');
    }
    statesList = JSON.parse(data)['states'];
  });

  fs.readFile('db/cities.json', 'utf-8', function (error, data) {
    if (error) {
      console.error(error);
      throw new Error('Unable to load cities file');
    }

    citiesData = JSON.parse(data);
    // Bad
    global.citiesData = citiesData;

    citiesList = Object.keys(citiesData);
  })
}

/**
 * Assignment: This method takes O(N) time to search for possible matches.
 * Even though it works, its better to have a optimized approach.
 * 
 * Improve this function in a way to support higher throughput
 */
function cityFinder(target) {
  return citiesList.filter((cityName) => cityName.toUpperCase().startsWith(target.toUpperCase()))
}

loadData();

router.get('/state', (req, res) => {
  const { stateName } = req.query;

  if (!stateName) {
    return res.json(statesList.map(state => ({ 'name': state.name, 'code': state.code })))
  }

  return res.json(
    statesList
      .filter((state) => state.name.toUpperCase().startsWith(stateName.toUpperCase()))
      .map((state) => ({ name: state.name, code: state.code }))
    )
});

router.get('/state/:stateName/districts', (req, res) => {
  const { districtName } = req.query;
  const { stateName } = req.params;

  if (!stateName) {
    return res.status(400).json({
      error: 'State Name is not specified',
    });
  }

  if (!districtName) {
    return res.json(
      statesList
        .filter((state) => state.name.toUpperCase().startsWith(stateName.toUpperCase()))
        .map(({ districts }) => ([ ...districts ]))[0]
    )
  }
});

router.get('/city', (req, res) => {
  const { cityName } = req.query;

  if (!cityName) {
    return res.status(400).json({ error: 'City Name is not specified' })
  }

  const targetCities = cityFinder(cityName);
  
  res.json(targetCities.map(city => citiesData[city]));
})

module.exports = router;
module.exports.cityFinder = cityFinder;
