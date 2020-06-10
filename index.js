const express = require('express');

const app = express();
const PORT = process.env.PORT || 3100;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index', {
    name: 'Scaler Covid Tracker',
  });
});


app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});