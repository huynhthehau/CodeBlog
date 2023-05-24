import { CreateImageDto } from "../dtos/imagesPost.dto";
import { HttpException } from "../exceptions/HttpException";
import { ImagePost } from "../interfaces/imagesPost.interface";
import { UserModel } from "../models/users.model";
import ImagesPostRepository from "../repositories/imagesPost.repository";
import { isEmpty } from "../utils/validator.util";

export default class ImagesPostService {
  private readonly imagesPostRepository: ImagesPostRepository;
  private readonly users = UserModel;

  constructor() {
    this.imagesPostRepository = new ImagesPostRepository();
  }

  public async createImage(data: CreateImageDto): Promise<ImagePost> {
    if (isEmpty(data)) throw new HttpException(409, "Image data is empty");

    const checkIdUser = await this.users.findById(data.userId);
    if (!checkIdUser) throw new HttpException(409, "User doesn't exist");

    const createImage: ImagePost = await this.imagesPostRepository.create(data);
    return createImage;
  }

  public async deleteImage(id: string, userId: string): Promise<void> {
    if (isEmpty(id)) throw new HttpException(409, "id is empty");
    const image = await this.imagesPostRepository.findOne({
      _id: id,
      userId: userId,
    });
    if (!image) throw new HttpException(400, "image not found");
    await this.imagesPostRepository.delete(image._id);
  }

  public async findImagesByUserId(id: string): Promise<ImagePost[]> {
    if (isEmpty(id)) throw new HttpException(409, "user id is empty");

    const checkIdUser = await this.users.findById(id);
    if (!checkIdUser) throw new HttpException(409, "User doesn't exist");

    const findImagesByUserId: ImagePost[] =
      await this.imagesPostRepository.find({ userId: id });
    return findImagesByUserId;
  }

  public async findImageById(id: string): Promise<ImagePost> {
    if (isEmpty(id)) throw new HttpException(409, "image id is empty");

    const findImageById = await this.imagesPostRepository.findById(id);
    if (!findImageById) throw new HttpException(409, "Image doesn't exist");

    return findImageById;
  }
}
