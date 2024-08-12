import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client/dist directory
app.use(express.static('../client/dist'));

// Use the defined routes
app.use(routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});