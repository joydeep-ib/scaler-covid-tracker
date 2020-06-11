const express = require('express');
const path = require('path');

const geoRouter = require('./routes/geo');
const reportsRouter = require('./routes/report');

const app = express();
const PORT = process.env.PORT || 3100;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/static', express.static('static'))
app.use(express.json());
app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.render('pages/index', {
    name: 'Scaler Covid Tracker',
  });
});

app.use('/geo/', geoRouter);
app.use('/reports/', reportsRouter);

app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});