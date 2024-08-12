import fs from 'node:fs/promises';
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
  private async read() {
    return await fs.readFile('db/searchHistory.json', {
      encoding: 'utf8',
      flag: 'a+',
    });
  }

  private async write(cities: City[]) {
    return await fs.writeFile('db/searchHistory.json', JSON.stringify(cities, null, '\t'));
  }

  async getCities(): Promise<City[]> {
    const data = await this.read();
    let cities: City[];

    try {
      cities = [].concat(JSON.parse(data));
    } catch (err) {
      cities = [];
    }

    return cities;
  }

  async addCity(cityName: string): Promise<City> {
    if (!cityName) {
      throw new Error('City name cannot be blank');
    }

    const newCity = new City(cityName, uuidv4());

    const cities = await this.getCities();
    const cityExists = cities.some(city => city.name.toLowerCase() === cityName.toLowerCase());

    if (cityExists) {
      return newCity;
    }

    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  async removeCity(id: string): Promise<void> {
    const cities = await this.getCities();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();



