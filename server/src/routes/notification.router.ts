import NotificationController from "../controllers/notification.controller";
import { IdDto } from "../dtos/objecId.dto";
import { verify } from "../middlewares/auth.middlewares";
import { validationMiddleware } from "../middlewares/validation.middlewares";
import {
  permissionComment,
  permissionPost,
  permissionRecipient,
  permissionVotePost,
} from "../middlewares/permission.middlerwares";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "../dtos/notification.dto";
var router = require("express").Router();

const notificationController = new NotificationController();

//POST api/v1/notifications/new-comment/:id
router.post(
  "/new-comment/:id",
  validationMiddleware(IdDto, "params"),
  validationMiddleware(CreateNotificationDto, "body"),
  verify,
  permissionComment,
  notificationController.createNotificationWhenNewComment
);

//POST api/v1/notifications/new-post/:id
router.post(
  "/new-post/:id",
  validationMiddleware(IdDto, "params"),
  validationMiddleware(CreateNotificationDto, "body"),
  verify,
  permissionPost,
  notificationController.createNotificationWhenNewPost
);

//POST api/v1/notifications/vote-post/:id
router.post(
  "/vote-post/:id",
  validationMiddleware(IdDto, "params"),
  validationMiddleware(CreateNotificationDto, "body"),
  verify,
  permissionVotePost,
  notificationController.createNotificationWhenVotePost
);

//patch api/v1/notifications/:Id
router.patch(
  "/:id",
  validationMiddleware(IdDto, "params"),
  validationMiddleware(UpdateNotificationDto, "body"),
  verify,
  permissionRecipient,
  notificationController.updateNotification
);

export default router;
