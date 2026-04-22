import { Router } from "express";
import multer from "multer";
import { deleteImageByKeyController, uploadController } from "./upload.controller";
import { authenticate } from "../../middleware/authicate";


const uploadRoute: Router = Router();
const upload= multer({storage: multer.memoryStorage()});
uploadRoute.post("/image",authenticate,upload.single("file"),uploadController);
uploadRoute.delete("/image", authenticate, deleteImageByKeyController);


export default uploadRoute;
