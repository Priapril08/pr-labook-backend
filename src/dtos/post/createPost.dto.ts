import { z } from "zod";

export interface CreatePostInputDTO {
  // id: string;
  creatorId: string;
  content: string;
  token: string;
}

export interface CreatePostOutputDTO {
  message: "Post cadastrado com sucesso!";
  content: string;
}

export const CreatePostSchema = z
  .object({
    // id: z.string().min(1),
    creatorId: z.string().min(1),
    content: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as CreatePostInputDTO);
