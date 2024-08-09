import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.city;
    
    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    // Get weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history
    await HistoryService.addCity(cityName);

    res.json(weatherData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving weather data', error: err.message });
  }
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving search history', error: err.message });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id;

    if (!cityId) {
      return res.status(400).json({ message: 'City ID is required' });
    }

    await HistoryService.removeCity(cityId);

    res.status(204).send(); // No content response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting city from search history', error: err.message });
  }
});

export default router;
