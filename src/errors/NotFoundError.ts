import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(
    message: string = "Recurso não encontrado" // msg padrão em caso de não haver argumento!!
  ) {
    super(404, message);
  }
}
