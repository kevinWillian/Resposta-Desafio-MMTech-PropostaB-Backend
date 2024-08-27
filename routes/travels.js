import express from 'express';

import getall from './../controllers/travel/getAll.js'
import get from './../controllers/travel/get.js'
import update from './../controllers/travel/update.js'
import remove from './../controllers/travel/delete.js'
import create from './../controllers/travel/create.js'

const router = express.Router();

router.get("/getAll", getall);
router.get("/", get);
router.put("/update", update);
router.delete("/remove/:id", remove);
router.post("/create", create);

export default router;