import express from 'express';
import {saveDonation, search} from "src/controllers/donation";

const router = express.Router();

router.post('', saveDonation);
router.get('', search);

export default router;
