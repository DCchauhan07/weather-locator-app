const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null, city: null });
});

app.post('/weather', async (req, res) => {
  const city = req.body.city;

  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`;
    const response = await axios.get(url);
    const data = response.data;

    const weather = {
      city: data.location.name,
      country: data.location.country,
      temperature: data.current.temp_c,
      feels_like: data.current.feelslike_c,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_kph,
      condition: data.current.condition.text
    };

    res.render('index', { weather, error: null, city });
  } catch (error) {
    console.log('API Error:', error.response ? error.response.data : error.message);

    res.render('index', {
      weather: null,
      error: 'City not found or API issue occurred.',
      city
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
