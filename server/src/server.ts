import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import routes from './routes/index.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client folder (assume client/dist is the build folder)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Use routes
app.use(routes);

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

