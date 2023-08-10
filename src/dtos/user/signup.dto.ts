import z from "zod";

export interface SignupInputDTO {
  // Não recebemos o id na requisição ao criar user (agora nossa API vai criá-lo)
  // id: string,
  name: string;
  email: string;
  password: string;
}

export interface SignupOutputDTO {
  message: string;
  token: string;
}

export const SignupSchema = z
  .object({
    // Não precisamos validar o id no schema (a lib uuid garante a estrutura do uuid v4)
    // id: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4),
  })
  .transform((data) => data as SignupInputDTO);
