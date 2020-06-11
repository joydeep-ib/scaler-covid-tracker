const express = require('express');
const fs = require('fs');
const { cityFinder } = require('./geo');

const router = express.Router();

let allReports = [];

function loadDB() {
  fs.readFile('db/reports.json', 'utf-8', (error, data) => {
    if (error) {
      console.log(error);
      throw new Error('Unable to read reports file');
    }

    allReports = JSON.parse(data);
  })
}

loadDB()

async function saveDB() {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(allReports);

    fs.writeFile('db/reports.json', jsonData, (error) => {
      if (error) {
        console.error(error);

        reject(error);
      }

      console.log('Response Written to File');
      resolve();
    });
  });
}

async function createReport({ name, age, gender, state, district, city }) {
  const pid = allReports.length;
  const { longitude, latitude } = global.citiesData[city];

  allReports.push({
    id: pid, name, age, gender, state, district, city, latitude, longitude
  })

  console.log(allReports)
  await saveDB();
}

async function readReport(reportId) {
  // Todo: Implement

  await saveDB();
}

async function updateReport(reportId) {
  // Todo: Implement

  await saveDB();
}

async function removeReport(reportId) {
  // Todo: Implement

  await saveDB();
}

/**
 * GET - List of all reports
 * POST - Not Supported
 * PUT - Not Supported
 * DELETE - Not Supported
 */
router.route('/')
  .get((req, res) => {
    res.render('pages/reports', {
      reports: allReports,
      // leaving this key for you all to explore, when writing production code, please use process.env.ENV_VAR name to get
      // these sensitive information. 
      mapboxKey: 'pk.eyJ1Ijoiam95ZGVlcC1pYiIsImEiOiJja2I4eXhpcWEwOTEwMnVwa3ZsOGg3ZmZ1In0.oS2EZQ7fdhItSubL4NMZBA',

    });
  })
  .post((req, res) => {
    res.status(405).send('Method Not Supported')
  });

/**
 * GET - List of all reports
 * POST - Create new report
 * PUT - Not Supported
 * DELETE - Not Supported
 */
router.route('/new')
  .get((req, res) => {
    res.render('pages/create_report', {});
  })
  .post((req, res) => {
    const { pname: name, age, gender, pstate: state, district, city } = req.body;

    createReport({ name, age, gender, state, district, city });

    res.redirect('/reports')
  });

/**
 * GET - Display a single report
 * POST - Not Supported
 * PUT - Update report
 * DELETE - Delete that report
 */
router.route('/:reportId')
  .get((req, res) => {
    res.render('pages/report', {});
  })
  .post((req, res) => {
    res.status(405).send("Method not allowed")
  })
  .put((req, res) => {

  })
  .delete((req, res) => {

  })

module.exports = router;
