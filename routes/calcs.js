import express from 'express';

import start from './../controllers/calcs/startCalc.js'
import getIsCalc from './../controllers/calcs/getIsCalc.js'

const router = express.Router();

router.get("/startcalc", start);
router.get("/getIsCalc", getIsCalc);

export default router;