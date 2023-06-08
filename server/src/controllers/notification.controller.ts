import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { limitString } from "../utils/convertString.util.";
import { CreateNotificationDto } from "../dtos/notification.dto";
import {
  RequestWithUser,
  RequestWithUserAndComment,
  RequestWithUserAndPost,
  ResponseWithSocket,
} from "../interfaces/auth.interface";
import { User } from "../interfaces/users.interface";
import CommentService from "../services/comment.service";
import Follow_UserService from "../services/follow_user.service";
import NotificationService from "../services/notifications.service";
import PostsService from "../services/posts.service";
import Notification from "../interfaces/notifications.interface";
import { Post } from "../interfaces/posts.interface";
import Vote_PostService from "../services/vote_post.service";

export default class NotificationController {
  public notificationService = new NotificationService();
  public followUserService = new Follow_UserService();
  public postService = new PostsService();
  public commentsService = new CommentService();
  public votePostService = new Vote_PostService();

  public getNotificationsOfUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { limit = 10, page = 1 } = req.query;
      const user: User = req.user;

      let pagination: any = {
        skip: (+page - 1) * +limit,
        take: +limit,
        filter: { recipient: user._id, status: true },
      };

      const { notifications, total, totalNotRead } =
        await this.notificationService.findNotificationsOfUser(pagination);

      const count: number = notifications.length;
      const total_pages = Math.floor(
        +total % +limit == 0 ? +total / +limit : +total / +limit + 1
      );
      pagination = {
        count: +count,
        total: +total,
        per_page: +limit,
        current_page: +page,
        total_pages: +total_pages,
      };
      res
        .status(200)
        .json({ count: count, totalNotRead, notifications, pagination });
    } catch (error) {
      next(error);
    }
  };

  public createNotificationWhenVotePost = async (
    req: RequestWithUserAndPost,
    res: ResponseWithSocket,
    next: NextFunction
  ) => {
    try {
      const {
        user,
        post,
        vote_post,
        body: { link },
      } = req;
      if (!post._id) {
        return res.status(400).json({ msg: "Missing comment information" });
      }
      const { io } = res;

      const notificationData: CreateNotificationDto = {
        sender: user._id,
        link,
        recipient: post.userId,
        content: `<p><span style="color:#709bd0;">${
          user.display_name
        }</span> đã ${
          vote_post.type
        } bài viết <span style="color:#709bd0;">${limitString(
          post.title,
          30
        )}</span><p>`,
      };

      if (notificationData.sender + "" == notificationData.recipient + "") {
        res.status(200).json({
          msg: "no notification when vote because  user is the author",
        });
      } else {
        const notification = await this.notificationService.createNotification(
          notificationData
        );
        io.sockets.sockets.forEach((socket: any) => {
          if (socket.userId == notification.recipient) {
            socket.emit("vote-post", notification);
          }
        });
        res.status(201).json({
          notification,
          msg: "create notification when new vote post",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public createNotificationWhenNewComment = async (
    req: RequestWithUserAndComment,
    res: ResponseWithSocket,
    next: NextFunction
  ) => {
    try {
      const {
        user,
        comment,
        body: { link },
      } = req;
      const { io } = res;
      if (!comment.postId) {
        return res.status(400).json({ msg: "Missing comment information" });
      }

      const notificationData: CreateNotificationDto = {
        sender: user._id,
        link,
        recipient: "",
        content: `<p><span style="color:#709bd0;">${user.display_name}</span> `,
      };

      if (!comment.inReplyToComment) {
        const post: Post = await this.postService.findPostById(
          comment.postId + ""
        );
        notificationData.recipient = post.user._id;
        notificationData.content += `đã bình luận về bài viết <span style="color:#709bd0;">${post.title}</span></p>`;
        if (notificationData.sender + "" != notificationData.recipient + "") {
          const notification: Notification =
            await this.notificationService.createNotification(notificationData);
          io.sockets.sockets.forEach((socket: any) => {
            if (socket.userId == notification.recipient) {
              socket.emit("new-comment", notification);
            }
          });
          res.status(201).json({
            notification,
            msg: "create notification when new comment",
          });
        }
      } else {
        const inReplyToComment = await this.commentsService.findCommentById(
          comment.inReplyToComment + ""
        );
        const post = await this.postService.findPostById(
          inReplyToComment.postId + ""
        );
        if (inReplyToComment.userId == post.user._id) {
          notificationData.recipient = inReplyToComment.userId;
          notificationData.content += `đã trả lời bình luận của bạn về bài viết <span style="color:#709bd0;">${limitString(
            post.title,
            40
          )}</span></p>`;
          if (notificationData.sender + "" != notificationData.recipient + "") {
            const notificationComment =
              await this.notificationService.createNotification(
                notificationData
              );
            io.sockets.sockets.forEach((socket: any) => {
              if (socket.userId == notificationComment.recipient) {
                socket.emit("new-comment", notificationComment);
              }
            });
            res.status(201).json({
              notifications: notificationComment,
              msg: "create notification when new comment",
            });
          }
        } else {
          notificationData.recipient = inReplyToComment.userId;
          notificationData.content += `đã trả lời bình luận của bạn về bài viết <span style="color:#709bd0;">${limitString(
            post.title,
            20
          )}</span></p>`;
          //
          let notificationComment: Notification | null = null;
          let notification: Notification | null = null;
          if (notificationData.sender + "" != notificationData.recipient + "") {
            notificationComment =
              await this.notificationService.createNotification(
                notificationData
              );
          }

          notificationData.recipient = post.user._id;
          notificationData.content = `<p><span style="color:#709bd0;">${
            user.display_name
          }</span> đã bình luận về bài viết <span style="color:#709bd0;">${limitString(
            post.title,
            40
          )}</span></p>`;
          //
          if (notificationData.sender + "" != notificationData.recipient + "") {
            notification = await this.notificationService.createNotification(
              notificationData
            );
          }
          if (notification || notificationComment) {
            io.sockets.sockets.forEach((socket: any) => {
              if (
                notificationComment &&
                socket.userId == notificationComment.recipient
              ) {
                socket.emit("new-comment", notificationComment);
              }

              if (notification && socket.userId == notification.recipient) {
                socket.emit("new-comment", notification);
              }
            });
            res.status(201).json({
              notifications: [notificationComment, notification],
              msg: "create notification when new comment",
            });
          }
        }
      }
      res.status(200).json({
        msg: "no notification when new comment because  user is the author",
      });
    } catch (error) {
      next(error);
    }
  };

  public createNotificationWhenNewPost = async (
    req: RequestWithUser,
    res: ResponseWithSocket,
    next: NextFunction
  ) => {
    try {
      const user: User = req.user;
      const postId = req.params.id;
      const { link, content } = req.body;
      const { io } = res;

      const listFollowerUserId: ObjectId[] =
        await this.followUserService.getListFollowerIds(user._id);
      const listFollowerTagId: ObjectId[] = (
        await this.postService.getListFollowerIds(postId)
      ).filter((e) => e + "" != user._id);

      const listFollowerId: ObjectId[] = listFollowerUserId
        .concat(listFollowerTagId)
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v.toHexString() === value.toHexString()) ===
            index
        );
      const notification: CreateNotificationDto[] = listFollowerId.map((e) => {
        return {
          sender: user._id,
          link: link,
          recipient: e.toString(),
          content: content,
        };
      });
      if (notification.length === 0) {
        res.status(400).json({
          msg: "no followers so no notification",
        });
      } else {
        const createNotifications =
          await this.notificationService.createNotifications(notification);
        createNotifications.forEach((e) => {
          io.sockets.sockets.forEach((socket: any) => {
            if (socket.userId == e.recipient) {
              socket.emit("new-post", e);
            }
          });
        });
        res.status(201).json({
          notifications: createNotifications,
          msg: "create notifications when new post",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  public readNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const filter = { isRead: true };

      const updateNotification =
        await this.notificationService.updateNotification(id, filter);

      res.status(200).json({ updateNotification, message: "updated" });
    } catch (error) {}
  };

  public updateNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const data = req.body;

      const updateNotification =
        await this.notificationService.updateNotification(id, data);

      res.status(200).json({ updateNotification, message: "updated" });
    } catch (error) {
      next(error);
    }
  };
}
