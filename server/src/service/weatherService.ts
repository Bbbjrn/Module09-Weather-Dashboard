import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  cityName: string;
  date: string;
  description: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;

  constructor(
    cityName: string,
    date: string,
    description: string,
    temperature: number,
    humidity: number,
    windSpeed: number,
    icon: string
  ) {
    this.cityName = cityName;
    this.date = date;
    this.description = description;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
  }
}

// Complete the WeatherService class
class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private cityName?: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }

  // Fetch coordinates using the OpenWeather API's geocoding feature
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(
      `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );
    if (!response.ok) {
      throw new Error('Error fetching location data');
    }
    const locationData = await response.json();
    if (locationData.length === 0) {
      throw new Error('No location found');
    }
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  // Build weather query string using coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Fetch weather data from the API
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (!response.ok) {
      throw new Error('Error fetching weather data');
    }
    return await response.json();
  }

  // Parse current weather data from the API response
  private parseCurrentWeather(response: any): Weather {
    const current = response.list[0];
    return new Weather(
      response.city.name,
      current.dt_txt,
      current.weather[0].description,
      current.main.temp,
      current.main.humidity,
      current.wind.speed,
      current.weather[0].icon
    );
  }

  // Build forecast array using weather data
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((entry: any) => {
      return new Weather(
        currentWeather.cityName,
        entry.dt_txt,
        entry.weather[0].description,
        entry.main.temp,
        entry.main.humidity,
        entry.wind.speed,
        entry.weather[0].icon
      );
    });
  }

  // Get weather for a city by fetching coordinates first, then weather data
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    this.cityName = city;

    const coordinates = await this.fetchLocationData(this.cityName);
    const weatherData = await this.fetchWeatherData(coordinates);

    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);

    return { current: currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();


