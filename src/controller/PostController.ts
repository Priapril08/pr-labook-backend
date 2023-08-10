import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import {
  CreatePostOutputDTO,
  CreatePostSchema,
} from "../dtos/post/createPost.dto";
import { PostBusiness } from "../business/PostBusiness";
import { EditPostOutputDTO, EditPostSchema } from "../dtos/post/editPost.dto";
import {
  DeletePostOutputDTO,
  DeletePostSchema,
} from "../dtos/post/deletePost.dto";
import { LikeOrDislikePostSchema } from "../dtos/post/likeOrDislikePost.dto";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public getPosts = async (_req: Request, res: Response) => {
    try {
      const input: GetPostsInputDTO = undefined;
      const output: GetPostsOutputDTO = await this.postBusiness.getPosts(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado!");
      }
    }
  };

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        // id: req.body.id,
        creatorId: req.body.creatorId,
        content: req.body.content,
        token: req.headers.authorization,
      });
      console.log(input);

      const output: CreatePostOutputDTO = await this.postBusiness.createPost(
        input
      );

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public editPost = async (req: Request, res: Response) => {
    try {
      const input = EditPostSchema.parse({
        id: req.params.id,
        content: req.body.content,
        token: req.headers.authorization,
      });

      const output: EditPostOutputDTO = await this.postBusiness.editPost(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        id: req.params.id,
        token: req.headers.authorization,
      });
      const output: DeletePostOutputDTO = await this.postBusiness.deletePost(
        input
      );
      res.status(200).send(output);
      console.log(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
        like: req.body.like
      });
      console.log(input);

      const output = await this.postBusiness.likeOrDislikePost(input);

      res.status(200).send(output);
      console.log(output);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };
}
