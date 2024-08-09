import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; // Import path module for handling file paths
dotenv.config();

// Import the routes
import routes from './routes/index';

const app = express();

const PORT = process.env.PORT || 3001;

// Serve static files from the entire client dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Implement middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Implement middleware to connect the routes
app.use(routes);

// Catch-all route to serve index.html for any client-side routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));

