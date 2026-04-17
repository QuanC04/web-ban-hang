import { Router } from "express";
import { getMeController } from "./user.controller";
import { authenticate } from "../../middleware/authicate";
import { updateProfileController } from "./user.controller";

const userRoutes: Router = Router();

userRoutes.get("/me", authenticate, getMeController);
userRoutes.put("/me", authenticate, updateProfileController);

export default userRoutes;
