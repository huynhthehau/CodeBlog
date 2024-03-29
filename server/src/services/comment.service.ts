import { CreateCommentDto } from "../dtos/comment.dto";
import { HttpException } from "../exceptions/HttpException";
import { Comment } from "../interfaces/comment.interface";
import { PostModel } from "../models/posts.model";
import { UserModel } from "../models/users.model";
import CommentRepository from "../repositories/comments.repository";
import { isEmpty } from "../utils/validator.util";

export default class CommentService {
  private readonly users = UserModel;
  private readonly posts = PostModel;
  private readonly commentRepository: CommentRepository;

  constructor() {
    this.commentRepository = new CommentRepository();
  }

  // public async commentReplyComment(
  //   commentData: CreateCommentDto
  // ): Promise<Comment> {
  //   const checkIdUser = await this.users.findById(commentData.userId);
  //   if (!checkIdUser) throw new HttpException(409, "User doesn't exist");

  //   const checkCommentId = await this.commentRepository.findById(
  //     commentData.inReplyToComment
  //   );
  //   if (!checkCommentId) throw new HttpException(409, "Comment doesn't exist");
  //   const comment = await this.commentRepository.create(commentData);
  //   return comment;
  // }

  public async comment(commentData: CreateCommentDto): Promise<Comment> {
    const checkIdUser = await this.users.findById(commentData.userId);
    if (!checkIdUser) throw new HttpException(409, "User doesn't exist");

    const checkIdPost = await this.posts.findById(commentData.postId);
    if (!checkIdPost) throw new HttpException(409, "Post doesn't exist");
    const comment = await this.commentRepository.create(commentData);
    return comment;
  }

  public async findCommentsOfPost(
    postId: string,
    pagination: any
  ): Promise<Comment[]> {
    if (isEmpty(postId)) throw new HttpException(409, "post id is empty");

    const checkIdPost = await this.posts.findById(postId);
    if (!checkIdPost) throw new HttpException(409, "Post doesn't exist");

    const comments: Comment[] = await this.commentRepository.findCommentOfPost(
      postId,
      pagination.take,
      pagination.skip
    );
    return comments;
  }

  public async findCommentById(commentId: string): Promise<Comment> {
    if (isEmpty(commentId)) throw new HttpException(409, "comment id is empty");

    const checkComment = await this.commentRepository.findById(commentId);
    if (!checkComment) throw new HttpException(409, "Comment doesn't exist");

    return checkComment;
  }

  public async totalCommentOfPost(postId: string): Promise<Number> {
    if (isEmpty(postId)) throw new HttpException(409, "post id is empty");

    const checkIdPost = await this.posts.findById(postId);
    if (!checkIdPost) throw new HttpException(409, "Post doesn't exist");

    const total = await this.commentRepository.total({ postId: postId });
    return total;
  }

  public async deleteComment(commentId: string): Promise<void> {
    if (isEmpty(commentId)) throw new HttpException(409, "comment id is empty");

    await this.commentRepository.delete(commentId);
    await this.commentRepository.deleteReplyComments(commentId);
  }
}
