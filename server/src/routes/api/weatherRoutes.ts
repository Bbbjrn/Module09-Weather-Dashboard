import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

const router = Router();

// POST route to fetch weather data by city name
router.post('/', async (req, res) => {
  try {
    const { city, state, country, units, lang } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data directly using the city name
    const weatherData = await WeatherService.getWeatherForCity(city, state, country, units, lang);

    // Save the city to search history
    const sanitizedCityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    await HistoryService.addCity(sanitizedCityName);

    return res.json(weatherData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// GET route to retrieve search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// DELETE route to remove a city from search history by ID
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;



