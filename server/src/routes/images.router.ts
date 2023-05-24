var router = require("express").Router();
import ImageController from "../controllers/images.controller";
import { verify } from "../middlewares/auth.middlewares";
import { uploadImage } from "../middlewares/multer.middlewares";
const imageController = new ImageController();

//GET /api/v1/images

//GET /api/v1/images/users

router.get("/me", verify, imageController.getImagesByUserId);
//GET /api/v1/images/:id

router.get("/:id", imageController.getImageById);
//POST /api/v1/images/uploads
router.post(
  "/uploads",
  verify,
  uploadImage.single("image"),
  imageController.uploadImage
);
router.delete("/:id", verify, imageController.deleteImage);

export default router;
