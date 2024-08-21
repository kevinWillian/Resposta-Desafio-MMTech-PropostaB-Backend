import express from 'express';

import getall from './../controllers/itinerarys/getAll.js'
import get from './../controllers/itinerarys/get.js'
import remove from './../controllers/itinerarys/delete.js'
import update from './../controllers/itinerarys/update.js'
import create from './../controllers/itinerarys/create.js'

const router = express.Router();

router.get("/", get);
router.get("/getAll", getall);
router.delete("/delete/:id", remove);
router.put("/update", update);
router.post("/create", create);

export default router;