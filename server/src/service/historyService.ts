import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';


class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}


class HistoryService {
  private filePath: string = 'db/searchHistory.json';


  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, { encoding: 'utf8', flag: 'a+' });
      const cities = JSON.parse(data || '[]');
      return Array.isArray(cities) ? cities : [];
    } catch (err) {
      console.error('Error reading history file:', err);
      return [];
    }
  }


  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing to history file:', err);
    }
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }


  async addCity(cityName: string): Promise<City> {
    if (!cityName) {
      throw new Error('City name cannot be blank');
    }

    const cities = await this.read();
    const existingCity = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());

    if (existingCity) {
      return existingCity;
    }

    const newCity = new City(cityName, uuidv4());
    cities.push(newCity);

    await this.write(cities);

    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();

