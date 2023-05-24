import { NextFunction, Request, Response } from "express";
import { CreateImageDto } from "../dtos/imagesPost.dto";
import { RequestWithUser } from "../interfaces/auth.interface";
import { ImagePost } from "../interfaces/imagesPost.interface";
import ImagesPostService from "../services/imagesPost.service";

export default class ImageController {
  public imageService = new ImagesPostService();

  public uploadImage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const imagedata: CreateImageDto = {
        userId: req.user._id,
        name: req.file?.filename,
        basename: req.file?.originalname,
        path: req.file?.path,
      };
      const createImage: ImagePost = await this.imageService.createImage(
        imagedata
      );
      res.status(201).json({ data: createImage });
    } catch (error) {
      next(error);
    }
  };

  public deleteImage = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      await this.imageService.deleteImage(id, userId);
      res.status(200).json({ msg: "deleted" });
    } catch (error) {
      next(error);
    }
  };

  public getImagesByUserId = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { _id } = req.user;
      const findImages: ImagePost[] =
        await this.imageService.findImagesByUserId(_id + "");
      res.status(200).json({ data: findImages });
    } catch (error) {
      next(error);
    }
  };

  public getImageById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id: string = req.params.id;
      const findImageById: ImagePost = await this.imageService.findImageById(
        id
      );
      res.status(200).json({ data: findImageById });
    } catch (error) {
      next(error);
    }
  };
}
