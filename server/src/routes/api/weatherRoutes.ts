import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  const { city } = req.body;
  await HistoryService.addCity(city);
  const weatherData = await WeatherService.getWeatherForCity(city);
  // TODO: save city to search history
  res.json(weatherData);
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  const history = await HistoryService.getCities();
  res.json(history);
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
