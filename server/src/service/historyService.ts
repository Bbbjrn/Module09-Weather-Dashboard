import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}

class HistoryService {
  private async read(): Promise<string> {
    try {
      const data = await fs.readFile('db/searchHistory.json', {
        encoding: 'utf8',
        flag: 'a+',
      });
      return data;
    } catch (err) {
      console.error('Error reading history file:', err);
      throw err;
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
    } catch (err) {
      console.error('Error writing to history file:', err);
      throw err;
    }
  }

  async getCities(): Promise<City[]> {
    const data = await this.read();
    let cities: City[];

    try {
      cities = JSON.parse(data);
    } catch (err) {
      cities = [];
    }

    return cities;
  }

  async addCity(cityName: string): Promise<City> {
    if (!cityName) {
      throw new Error('City name cannot be blank');
    }

    const newCity = new City(cityName);
    const cities = await this.getCities();

    if (cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase())) {
      return cities.find((city) => city.name.toLowerCase() === cityName.toLowerCase())!;
    }

    cities.push(newCity);
    await this.write(cities);

    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city) => city.id !== id);

    await this.write(updatedCities);
  }
}

export default new HistoryService();


