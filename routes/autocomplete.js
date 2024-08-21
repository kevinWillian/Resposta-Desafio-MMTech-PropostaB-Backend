import express from 'express';

import get from './../controllers/autocomplete/get.js'

const router = express.Router();

router.get("/", get);

export default router;