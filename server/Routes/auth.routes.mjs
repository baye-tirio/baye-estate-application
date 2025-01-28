import { Router } from "express";
import { signUp,signIn ,googleAuth} from "../controllers/auth.controllers.mjs";
const router = Router();
//Endpoint to manage signing up into the real estate application
router.post("/sign-up",signUp)
//Endpoint to manage signing in into the real estate application
router.post("/sign-in",signIn)
//Endpoint to handle sign in with google
router.post("/google",googleAuth);
export default router;