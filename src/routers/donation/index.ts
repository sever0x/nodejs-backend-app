import express from 'express';
import {saveDonation} from "src/controllers/donation";

const router = express.Router();

router.post('', saveDonation);

export default router;
