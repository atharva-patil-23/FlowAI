import { Router } from "express";
import validate from "../middleware/validate.js";
import authMiddleware from "../middleware/auth.js";
import { signupSchema, loginSchema, updatePreferencesSchema } from "../validations/auth.js";
import { signup, login, me, updatePreferences } from "../controllers/authController.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, me);
router.patch(
    "/me/preferences",
    authMiddleware,
    validate(updatePreferencesSchema),
    updatePreferences
);

export default router;
