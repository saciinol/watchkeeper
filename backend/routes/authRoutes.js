import express from "express";
import { validateLogin, validateRegistration } from "../middleware/validation.js";
import { loginAuth, registerAuth } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", validateRegistration, registerAuth);
router.post("/login", validateLogin, loginAuth);

export default router;
