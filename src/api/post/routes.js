import express from "express";

import { create } from "../post/controller";
import { isValidUser } from "../auth/controller";

const router = express.Router();

router.post("/post/user", isValidUser, create);

export default router;
