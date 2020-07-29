import express from "express";

import * as answer from "../answer/controller";
import { isValidUser } from "../auth/controller";

const router = express.Router();

router.get("/answer/search", answer.search);

router.post("/answer/:postId", isValidUser, answer.create);

export default router;
