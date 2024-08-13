import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  constructor(public name: string, public id: string) {}
}

class HistoryService {
  private filePath = 'db/searchHistory.json';

  private async read(): Promise<string> {
    try {
      return await fs.readFile(this.filePath, { flag: 'a+', encoding: 'utf8' });
    } catch (err) {
      console.error('Error reading the file:', err);
      throw err;
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (err) {
      console.error('Error writing to the file:', err);
      throw err;
    }
  }

  async getCities(): Promise<City[]> {
    const data = await this.read();
    try {
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return [];
    }
  }

  async addCity(city: string): Promise<City> {
    if (!city) throw new Error('City name cannot be blank');

    const cities = await this.getCities();
    if (cities.find((existingCity) => existingCity.name === city)) {
      return cities.find((existingCity) => existingCity.name === city)!;
    }

    const newCity = new City(city, uuidv4());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const filteredCities = cities.filter((city) => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();




