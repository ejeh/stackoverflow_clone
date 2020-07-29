import express from "express";

import authRoute from "./auth";
import postRoute from "./post";
import answerRoute from "./answer";

const router = express.Router();

// Use Routes
router.use(authRoute);
router.use(postRoute);
router.use(answerRoute);

export default router;
