import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Register routes
app.use(routes);

export default app;
