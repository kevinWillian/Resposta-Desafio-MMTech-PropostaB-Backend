import express from 'express';
import mongoSanitize  from 'express-mongo-sanitize';
import cors from 'cors';

import itRoutes from './routes/itinerarys.js';
import travelRoutes from './routes/travels.js';
import routeDataRoutes from './routes/routeData.js';
import autoRoute from './routes/autocomplete.js'
import calcRoute from './routes/calcs.js'


const app = express();
const port = 3000;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/travels', travelRoutes);
app.use('/data', routeDataRoutes);
app.use('/itne', itRoutes);
app.use('/auto', autoRoute);
app.use('/calc', calcRoute);

app.listen(port, () => {
    console.log(`listen port:${port}`);
})