import dotenv from 'dotenv';
dotenv.config();

// Define the interfaces for the response data
interface Weather {
  cityName: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  pressure: number;
  humidity: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  windSpeed: number;
  windDeg: number;
  visibility: number;
  date: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }

  // Fetches location data (coordinates) based on the city name
  async getCoordinatesByCity(city: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
      );
      const locationData = await response.json();

      if (!locationData || locationData.length === 0) {
        throw new Error('City not found');
      }

      const coordinates: Coordinates = {
        lat: locationData[0].lat,
        lon: locationData[0].lon,
      };

      return coordinates;
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      throw err;
    }
  }

  // Fetches weather data based on the coordinates
  async getWeatherDataByCoordinates(coordinates: Coordinates) {
    try {
      const response = await fetch(
        `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`
      );
      const weatherData = await response.json();

      if (!weatherData || !weatherData.list) {
        throw new Error('Weather data not found');
      }

      return weatherData;
    } catch (err) {
      console.error('Error fetching weather data:', err);
      throw err;
    }
  }

  // Maps raw weather data to a structured format
  async mapWeatherData(weatherData: any) {
    try {
      const cityName = weatherData.city.name;

      const mappedWeatherData = weatherData.list.map((entry: any) => {
        return {
          cityName,
          temperature: entry.main.temp,
          feelsLike: entry.main.feels_like,
          tempMin: entry.main.temp_min,
          tempMax: entry.main.temp_max,
          pressure: entry.main.pressure,
          humidity: entry.main.humidity,
          weatherMain: entry.weather[0].main,
          weatherDescription: entry.weather[0].description,
          weatherIcon: entry.weather[0].icon,
          windSpeed: entry.wind.speed,
          windDeg: entry.wind.deg,
          visibility: entry.visibility,
          date: entry.dt_txt,
        } as Weather;
      });

      return mappedWeatherData;
    } catch (err) {
      console.error('Error mapping weather data:', err);
      throw err;
    }
  }

  // Retrieves and maps the current weather and forecast for a city
  async getWeatherForCity(city: string) {
    try {
      const coordinates = await this.getCoordinatesByCity(city);
      const weatherData = await this.getWeatherDataByCoordinates(coordinates);
      const mappedWeatherData = await this.mapWeatherData(weatherData);
      return mappedWeatherData;
    } catch (err) {
      console.error('Error getting weather for city:', err);
      throw err;
    }
  }
}

export default new WeatherService()

