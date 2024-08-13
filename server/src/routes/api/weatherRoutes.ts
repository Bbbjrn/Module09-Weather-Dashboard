import { Router, Request, Response } from 'express';
const router = Router();

import weatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';


// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Use WeatherService to get weather data for the provided city name
    const weatherData = await weatherService.getWeatherForCity(cityName);

    // Use HistoryService to save the city name to the search history
    await historyService.addCity(cityName);

    // Respond with the current weather and forecast data
    return res.json([weatherData.current, ...weatherData.forecast]);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Use HistoryService to retrieve the search history
    const cities = await historyService.getCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Use HistoryService to remove a city from the search history by ID
    await historyService.removeCity(id);
    res.json({ message: 'City removed from history' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove city from history' });
  }
});

export default router;



