import express from 'express';
import donation from "./donation";

const router = express.Router();

router.use('/donation', donation);

export default router;
