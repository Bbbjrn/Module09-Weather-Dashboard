import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// Complete the HistoryService class
class HistoryService {
  private filePath: string = 'db/searchHistory.json';

  // Read method that reads from the searchHistory.json file
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

  // Write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing to history file:', err);
    }
  }

  // GetCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // AddCity method that adds a city to the searchHistory.json file
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

  // * BONUS: RemoveCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const filteredCities = cities.filter(city => city.id !== id);
    await this.write(filteredCities);
  }
}

export default new HistoryService();

