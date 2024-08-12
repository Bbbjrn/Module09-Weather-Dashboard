import { Router, Request, Response } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City name is required' });
    }
    
    const coordinates = await WeatherService.getCoordinatesByCityName(city);
    const weatherData = await WeatherService.getWeatherByCoordinates(coordinates);
    const forecastData = await WeatherService.getForecastByCoordinates(coordinates);
    await HistoryService.addCity(city);

    return res.json({ weather: weatherData, forecast: forecastData });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;


