import express from 'express';
import donation from "./donation";

const router = express.Router();

router.use('/api/donation', donation);

export default router;
