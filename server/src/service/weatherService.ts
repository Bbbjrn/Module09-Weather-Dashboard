import dotenv from 'dotenv';
dotenv.config();

// Define interfaces for data structures
interface Coordinates {
  lat: number;
  lon: number;
}

interface WeatherData {
  cityName: string;
  date: string;
  icon: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

class WeatherService {
  private baseURL?: string;
  private apiKey?: string;

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
          date: entry.dt_txt,
          icon: entry.weather[0].icon,
          description: entry.weather[0].description,
          temperature: entry.main.temp,
          humidity: entry.main.humidity,
          windSpeed: entry.wind.speed,
        } as WeatherData;
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

  // Retrieves the current weather
  async getCurrentWeather(city: string) {
    try {
      const weatherData = await this.getWeatherForCity(city);
      
      if (!weatherData || weatherData.length === 0) {
        throw new Error('No weather data available for the specified city');
      }

      return weatherData[0];
    } catch (err) {
      console.error('Error getting current weather:', err);
      throw err;
    }
  }

  // Retrieves the forecast for the next few days
  async getWeatherForecast(city: string) {
    try {
      const weatherData = await this.getWeatherForCity(city);
      
      if (!weatherData || weatherData.length === 0) {
        throw new Error('No forecast data available for the specified city');
      }

      return weatherData.slice(1);
    } catch (err) {
      console.error('Error getting weather forecast:', err);
      throw err;
    }
  }
}

export default new WeatherService();

