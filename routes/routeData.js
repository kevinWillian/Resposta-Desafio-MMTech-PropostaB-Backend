import express from 'express';

import get from './../controllers/routeData/get.js'

const router = express.Router();

router.get("/:id", get);

export default router;