import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService';
import WeatherService from '../../service/weatherService';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save the city to search history
    await HistoryService.addCity(cityName);

    return res.json(weatherData);
  } catch (error) {
    console.error('Error in POST /api/weather:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error in GET /api/weather/history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.status(204).end();
  } catch (error) {
    console.error('Error in DELETE /api/weather/history/:id:', error);
    res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;




