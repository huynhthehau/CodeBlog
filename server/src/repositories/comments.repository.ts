import { Comment } from "../interfaces/comment.interface";
import { CommentModel } from "../models/comments.model";
import BaseRepository from "./base.repository";
import { ObjectId } from "mongodb";
export default class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(CommentModel);
  }
  async findCommentOfPostWithPopulate(
    filter = {},
    take: number,
    skip: number
  ): Promise<Comment[]> {
    return this.model
      .find(filter)
      .skip(skip)
      .limit(take)
      .populate({ path: "user", select: ["display_name", "email", "avatar"] })
      .exec();
  }
  async findCommentById(commentId: string): Promise<any> {
    const data = this.model
      .aggregate([
        {
          $match: { _id: new ObjectId(commentId) },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "inReplyToComment",
            as: "commentsReply",
          },
        },
      ])
      .exec();
    console.log(data);
    return data;
  }
  async findCommentOfPost(
    id: string,
    take: number,
    skip: number
  ): Promise<Comment[]> {
    return this.model.aggregate([
      {
        $match: {
          $and: [{ postId: new ObjectId(id) }, { inReplyToComment: null }],
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: take },
      {
        $lookup: {
          from: "vote_comments",
          localField: "_id",
          foreignField: "commentId",
          as: "votes",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "inReplyToComment",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
              },
            },
            {
              $project: {
                user: {
                  password: 0,
                  __v: 0,
                },
              },
            },
            {
              $project: {
                _id: 1,
                postId: 1,
                content: 1,
                status: 1,
                votes: {
                  $reduce: {
                    input: "$votes",
                    initialValue: 0,
                    in: {
                      $add: [
                        "$$value",
                        {
                          $cond: {
                            if: { $eq: ["$$this.type", "Upvote"] },
                            then: 1,
                            else: {
                              $cond: {
                                if: { $eq: ["$$this.type", "Downvote"] },
                                then: -1,
                                else: 0,
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                user: { $arrayElemAt: ["$user", 0] },
                inReplyToComment: 1,
                inReplyToUser: 1,
                commentsReply: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          as: "commentsReply",
        },
      },
      {
        $project: {
          user: {
            password: 0,
            __v: 0,
          },
        },
      },
      {
        $project: {
          _id: 1,
          postId: 1,
          content: 1,
          status: 1,
          votes: {
            $reduce: {
              input: "$votes",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $cond: {
                      if: { $eq: ["$$this.type", "Upvote"] },
                      then: 1,
                      else: {
                        $cond: {
                          if: { $eq: ["$$this.type", "Downvote"] },
                          then: -1,
                          else: 0,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
          user: { $arrayElemAt: ["$user", 0] },
          inReplyToComment: 1,
          inReplyToUser: 1,
          commentsReply: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }
  async total(filter = {}): Promise<Number> {
    return await this.model.find(filter).count().exec();
  }
  async deleteReplyComments(commentId: string): Promise<void> {
    await this.model.deleteMany({ inReplyToComment: commentId });
  }
  async deleteCommentsOfPost(postId: string): Promise<void> {
    await this.model.deleteMany({ postId: postId });
  }
}
