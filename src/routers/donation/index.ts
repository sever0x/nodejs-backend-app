import express from 'express';
import {count, saveDonation, search} from "src/controllers/donation";

const router = express.Router();

router.post('', saveDonation);
router.get('', search);
router.post('/_counts', count);

export default router;
