import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import config from './config.js';
import router from '../routes/index.js';

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route init
router(app);

app.listen(3000, () =>
  console.log(`Server is running on port ${config.port}`),
);