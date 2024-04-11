import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';
import router from './routes/index.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route init
router(app);

app.listen(config.port, () =>
  console.log(`Server is running on port ${config.port}`),
);