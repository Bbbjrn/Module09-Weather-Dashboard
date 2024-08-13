import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  city: string;
  date: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchLocationData(cityName: string): Promise<Coordinates> {
    const geocodeURL = `${this.baseURL}/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(geocodeURL);
    const locations = await response.json();

    if (!locations.length) {
      throw new Error('Location not found');
    }

    const { lat, lon } = locations[0];
    return { lat, lon };
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherURL = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
    const response = await fetch(weatherURL);
    return await response.json();
  }

  public async getWeatherForCity(cityName: string): Promise<Weather[]> {
    try {
      const coordinates = await this.fetchLocationData(cityName);
      const weatherData = await this.fetchWeatherData(coordinates);

      return weatherData.list.map((entry: any) => ({
        city: weatherData.city.name,
        date: entry.dt_txt,
        tempF: entry.main.temp,
        windSpeed: entry.wind.speed,
        humidity: entry.main.humidity,
        icon: entry.weather[0].icon,
        iconDescription: entry.weather[0].description,
      }));
    } catch (err) {
      console.error('Error fetching weather data:', err);
      throw err;
    }
  }
}

export default new WeatherService();




