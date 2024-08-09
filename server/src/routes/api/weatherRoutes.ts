import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const cityName = req.body.city;
    
    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName);

    return res.json(weatherData); // Ensure a return statement here
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error retrieving weather data', error: (err as Error).message }); // Ensure a return statement here
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving search history', error: (err as Error).message });
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

    return res.status(204).send(); // Ensure a return statement here
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting city from search history', error: (err as Error).message }); // Ensure a return statement here
  }
});

export default router;

