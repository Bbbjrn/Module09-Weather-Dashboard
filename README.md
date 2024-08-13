# Weather Dashboard

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

## Description

The Weather Dashboard is a web application that allows users to search for current weather conditions and a 5-day forecast for cities around the world. It saves search history locally, making it easy for users to revisit their previous searches. This application leverages the OpenWeatherMap API for fetching weather data and stores search history in a JSON file on the server.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Bbbjrn/weather-dashboard.git
    cd weather-dashboard
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory and add your OpenWeatherMap API key:
    ```sh
    API_KEY=your_openweathermap_api_key
    ```

4. Build the frontend:
    ```sh
    cd client
    npm run build
    ```

5. Start the server:
    ```sh
    cd ../server
    npm start
    ```

6. Access the application:
    - Open your browser and navigate to `http://localhost:3001`.

## Usage

### Search for Weather

- **Search for a City**: Enter the name of a city in the search bar and click "Search". The application will display the current weather conditions and a 5-day forecast for the specified city.

### View Search History

- **Search History**: Previously searched cities will appear below the search bar. Clicking on a city from the history will re-fetch and display its weather data.

### Delete Search History

- **Remove a City**: Click the trash icon next to a city in the search history to delete it from the list.

### API Endpoints

- **Weather API**
  - `POST /api/weather/`: Accepts a city name in the request body, retrieves weather data from the OpenWeatherMap API, saves the city to `searchHistory.json`, and returns the weather data to the client.
  - `GET /api/weather/history`: Reads and returns the list of saved cities from `searchHistory.json`.
  - `DELETE /api/weather/history/:id`: Deletes a city from the search history based on its unique ID.

## Features

- **City Search**: Retrieve current weather and 5-day forecast by city name.
- **Search History**: Save and revisit previously searched cities.
- **Responsive UI**: The application is mobile-friendly and easy to use.
- **Real-time Data**: Fetches up-to-date weather data from the OpenWeatherMap API.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**Author**: Bjorn Johansson

**GitHub**: [Bbbjrn](https://github.com/Bbbjrn)

