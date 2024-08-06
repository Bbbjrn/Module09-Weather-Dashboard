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
  // Define the baseURL and API key properties
  private baseURL: string = process.env.API_BASE_URL || 'https://api.openweathermap.org';
  private apiKey: string = process.env.API_KEY || '';

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    return response.json();
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const geocodeQuery = this.buildGeocodeQuery(city);
    const locationData = await this.fetchLocationData(geocodeQuery);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    return response.json();
  }

  // Build parseCurrentWeather method
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

  // Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.slice(1, 6).map((entry: any) => {
      return new Weather(
        currentWeather.cityName,
        entry.dt_txt,
        entry.weather[0].icon,
        entry.weather[0].description,
        entry.main.temp,
        entry.main.humidity,
        entry.wind.speed
      );
    });
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<{ current: Weather; forecast: Weather[] }> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
    return { current: currentWeather, forecast: forecastArray };
  }
}

export default new WeatherService();

