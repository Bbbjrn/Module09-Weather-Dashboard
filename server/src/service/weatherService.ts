// import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  icon: string;
}

interface Forecast {
  date: string;
  temperature: number;
  windSpeed: number;
  icon: string;
}

class WeatherService {
  private baseURL?: string;
  private apiKey?: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5/';
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
  }

  async getWeatherByCoordinates(coordinates: Coordinates): Promise<Weather> {
    try {
      const response = await fetch(
        `${this.baseURL}weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`
      );
      const weatherData = await response.json();
      return this.mapWeatherData(weatherData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      throw err;
    }
  }

  async getForecastByCoordinates(coordinates: Coordinates): Promise<Forecast[]> {
    try {
      const response = await fetch(
        `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`
      );
      const forecastData = await response.json();
      return this.mapForecastData(forecastData.list);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      throw err;
    }
  }

  private mapWeatherData(data: any): Weather {
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      weatherDescription: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  }

  private mapForecastData(data: any[]): Forecast[] {
    return data.map((entry) => ({
      date: entry.dt_txt,
      temperature: entry.main.temp,
      windSpeed: entry.wind.speed,
      icon: entry.weather[0].icon,
    }));
  }

  async getCoordinatesByCityName(city: string): Promise<Coordinates> {
    try {
      const response = await fetch(
        `${this.baseURL}geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`
      );
      const locationData = await response.json();
      return { lat: locationData[0].lat, lon: locationData[0].lon };
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      throw err;
    }
  }
}

export default new WeatherService();


