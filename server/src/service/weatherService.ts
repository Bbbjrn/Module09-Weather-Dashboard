import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  constructor(
    public cityName: string,
    public date: string,
    public icon: string,
    public description: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number
  ) {}
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }

  // Fetches location data (coordinates) based on the city name
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    return response.json();
  }

  // Extracts and structures the coordinates from the location data
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    };
  }

  // Builds the query URL for fetching geocode data (coordinates) based on the city name
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }

  // Builds the query URL for fetching weather data based on the coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Fetches and structures the location data into coordinates
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const geocodeQuery = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(geocodeQuery);
    return this.destructureLocationData(locationData);
  }

  // Fetches weather data based on the coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    return response.json();
  }

  // Parses the current weather data from the API response
  private parseCurrentWeather(response: any): Weather {
    const current = response.list[0];
    return new Weather(
      response.city.name,
      current.dt_txt,
      current.weather[0].icon,
      current.weather[0].description,
      current.main.temp,
      current.main.humidity,
      current.wind.speed
    );
  }

  // Structures the weather data into an array of Weather objects for the 5-day forecast
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(0, 5).map((entry: any) => {
      return new Weather(
        weatherData.city.name,
        entry.dt_txt,
        entry.weather[0].icon,
        entry.weather[0].description,
        entry.main.temp,
        entry.main.humidity,
        entry.wind.speed
      );
    });
  }

  // Combines the methods to get the weather data for a city, including current weather and a 5-day forecast
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(weatherData.list);
    return { current: currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();
