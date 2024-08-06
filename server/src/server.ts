import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import weatherRoutes from './routes/api/weatherRoutes.js';
import htmlRoutes from './routes/htmlRoutes.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.static(path.join(__dirname, '../client')));
// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);
app.use('/', htmlRoutes);

app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
