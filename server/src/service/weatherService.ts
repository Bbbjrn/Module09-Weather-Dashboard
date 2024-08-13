import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  constructor(
    public date: string,
    public temp: number,
    public windSpeed: number,
    public humidity: number,
    public icon: string,
    public iconDescription: string
  ) {}
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;
  private cityName?: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    return await response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  private buildGeocodeQuery(): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const geocodeQuery = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(geocodeQuery);
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    return await response.json();
  }

  private parseCurrentWeather(response: any): Weather {
    const current = response.list[0];
    return new Weather(
      current.dt_txt,
      current.main.temp,
      current.wind.speed,
      current.main.humidity,
      current.weather[0].icon,
      current.weather[0].description
    );
  }

  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.map((item: any) => {
      return new Weather(
        item.dt_txt,
        item.main.temp,
        item.wind.speed,
        item.main.humidity,
        item.weather[0].icon,
        item.weather[0].description
      );
    });
  }

  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    this.cityName = city;

    // Get coordinates for the city
    const coordinates = await this.fetchAndDestructureLocationData();

    // Fetch weather data using the coordinates
    const weatherData = await this.fetchWeatherData(coordinates);

    // Parse the current weather
    const currentWeather = this.parseCurrentWeather(weatherData);

    // Build the forecast array
    const forecastArray = this.buildForecastArray(weatherData.list);

    return {
      current: currentWeather,
      forecast: forecastArray,
    };
  }
}

export default new WeatherService();



