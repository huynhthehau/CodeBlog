import { CreateBookmarkDto as BookmarkDto } from "../dtos/bookmarks.dto";
import { HttpException } from "../exceptions/HttpException";
import { Bookmark, BookmarkWithUser } from "../interfaces/ bookmarks.interface";
import { Post } from "../interfaces/posts.interface";
import { User } from "../interfaces/users.interface";
import { PostModel } from "../models/posts.model";
import { UserModel } from "../models/users.model";
import BookMarkRepository from "../repositories/bookmarks.repository";
import { isEmpty } from "../utils/validator.util";

export default class BookmarkService {
  private readonly bookmarkRepository: BookMarkRepository;
  private readonly users = UserModel;
  private readonly posts = PostModel;

  constructor() {
    this.bookmarkRepository = new BookMarkRepository();
  }

  public async getBookmark(data: any): Promise<Bookmark | null> {
    if (isEmpty(data)) throw new HttpException(409, "bookmark data is empty");
    const checkBookmark: Bookmark | null =
      await this.bookmarkRepository.findOne(data);
    if (!checkBookmark) return null;
    return checkBookmark;
  }

  public async getBookmarksOfUser(data: any): Promise<Bookmark[] | null> {
    if (isEmpty(data)) throw new HttpException(409, "bookmark data is empty");
    const bookmarks: Bookmark[] | null = await this.bookmarkRepository.find(
      data
    );
    return bookmarks;
  }

  public async bookmark(data: BookmarkDto): Promise<Bookmark> {
    if (isEmpty(data)) throw new HttpException(409, "bookmark data is empty");

    const checkPostId: Post = await this.posts.findById(data.postId);
    if (!checkPostId) throw new HttpException(409, "Post doesn't exist");

    const checkUserId: User = await this.users.findById(data.userId);
    if (!checkUserId) throw new HttpException(409, "User doesn't exist");

    const checkBookmark: Bookmark | null =
      await this.bookmarkRepository.findOne({
        postId: data.postId,
        userId: data.userId,
      });
    if (!checkBookmark) {
      const bookmark = await this.bookmarkRepository.create(data);
      return bookmark;
    } else throw new HttpException(400, "Bookmark does exist");
  }

  public async deleteBookmark(data: BookmarkDto): Promise<void> {
    if (isEmpty(data)) throw new HttpException(409, "bookmark data is empty");

    const checkPostId = await this.posts.findById(data.postId);
    if (!checkPostId) throw new HttpException(409, "Post doesn't exist");

    const checkUserId = await this.users.findById(data.userId);
    if (!checkUserId) throw new HttpException(409, "User doesn't exist");

    const checkBookmark = await this.bookmarkRepository.findOne({
      postId: data.postId,
      userId: data.userId,
    });
    if (checkBookmark) await this.bookmarkRepository.delete(checkBookmark._id);
    else throw new HttpException(400, "Bookmark doesn't exist");
  }

  public async findBookmarkPostsOfUser(
    filter: any,
    id: string
  ): Promise<{ posts: Post[]; total: Number }> {
    const posts: Post[] = await this.bookmarkRepository.findBookmarkPostsOfUser(
      id,
      filter.skip,
      filter.take,
      filter.sort,
      filter.search
    );
    const total: Number =
      await this.bookmarkRepository.countBookmarkPostsOfUser(id, filter.search);
    return { posts, total };
  }
}
