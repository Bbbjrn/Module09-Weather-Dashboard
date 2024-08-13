// import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

class WeatherService {
  private geoBaseURL: string;
  private forecastBaseURL: string;
  private apiKey: string;

  constructor() {
    this.geoBaseURL = 'https://api.openweathermap.org/geo/1.0/direct';
    this.forecastBaseURL = 'https://api.openweathermap.org/data/2.5/forecast';
    this.apiKey = process.env.API_KEY || '';
  }

  // Method to get latitude and longitude from the city name using Geocoding API
  async getCoordinatesByCityName(city: string, state?: string, country?: string) {
    try {
      let query = `${city}`;
      if (state) query += `,${state}`;
      if (country) query += `,${country}`;

      const response = await fetch(
        `${this.geoBaseURL}?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`
      );
      const locationData = await response.json();

      if (!locationData || locationData.length === 0) {
        throw new Error(`City not found or API response error`);
      }

      return { lat: locationData[0].lat, lon: locationData[0].lon };
    } catch (err) {
      console.error('Error fetching coordinates:', (err as Error).message || err);
      throw err;
    }
  }

  // Method to get weather data from the 5-day/3-hour forecast API
  async getWeatherByCoordinates(lat: number, lon: number, units: string = 'metric', lang: string = 'en') {
    try {
      const response = await fetch(
        `${this.forecastBaseURL}?lat=${lat}&lon=${lon}&units=${units}&lang=${lang}&appid=${this.apiKey}`
      );
      const weatherData = await response.json();

      if (weatherData.cod !== '200') {
        throw new Error(`Weather data not found or API response error: ${weatherData.message}`);
      }

      return weatherData;
    } catch (err) {
      console.error('Error fetching weather data:', (err as Error).message || err);
      throw err;
    }
  }

  // Method to combine the above functionalities
  async getWeatherForCity(city: string, state?: string, country?: string, units: string = 'metric', lang: string = 'en') {
    const { lat, lon } = await this.getCoordinatesByCityName(city, state, country);
    return this.getWeatherByCoordinates(lat, lon, units, lang);
  }
}

export default new WeatherService();



