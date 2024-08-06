import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City { 
  constructor(public id: string, public name: string) {}
}


// TODO: Complete the HistoryService class
class HistoryService {
  private historyFilePath = path.join(__dirname, '../../db/searchHistory.json');
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.promises.readFile(this.historyFilePath, 'utf8');
      return data.length ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Error reading history file', err);
      return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.historyFilePath, JSON.stringify(cities));
    } catch (err) {
      console.error('Error writing history file', err);
  }
}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const newId = cities.length ? cities[cities.length - 1].id + 1 : 1;
    const newCity = new City(newId.toString(), city);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
