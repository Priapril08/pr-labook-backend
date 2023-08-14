import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import {
  CreatePostInputDTO,
  CreatePostOutputDTO,
} from "../dtos/post/createPost.dto";
import {
  DeletePostInputDTO,
  DeletePostOutputDTO,
} from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import {
  LikeOrDislikePostInputDTO,
  LikeOrDislikePostOutputDTO,
} from "../dtos/post/likeOrDislikePost.dto";
import { BadRequestError } from "../errors/BadRequestsError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  LikesDislikesDB,
  POST_LIKE,
  Post,
  PostDB,
  PostModel,
} from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}
  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const postsDB = await this.postDatabase.getAllPosts();

    const postsModel: PostModel[] = [];

    for (let postDB of postsDB) {
      const creatorDB = await this.userDatabase.findUserById(postDB.creator_id);

      if (!creatorDB) {
        throw new BadRequestError("O post não tem criador não identificado!");
      }

      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at,
        postDB.creator_id,
        creatorDB.name
      );

      postsModel.push(post.toPostModel());
    }
    const output: GetPostsOutputDTO = postsModel;
    return output;
  };

  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { creatorId, content, token } = input;

    const payload = this.tokenManager.getPayload(token);
    if (payload === null) {
      throw new BadRequestError(" Token inválido!");
    }

    if (payload.id !== creatorId) {
      throw new BadRequestError(" Usuário não autorizado para criar o post!");
    }

    const id = this.idGenerator.generate();

    const creatorDB = await this.userDatabase.findUserById(creatorId);

    if (!creatorDB) {
      throw new BadRequestError("Criador não existe!");
    }

    const newPost = new Post(
      id,
      content,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      creatorId,
      creatorDB.name
    );
    await this.postDatabase.insertPost(newPost.toPostDB());

    const output: CreatePostOutputDTO = {
      message: "Post cadastrado com sucesso!",
      content,
    };
    return output;
  };

  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const { id, content } = input;

    if (content !== undefined) {
      if (typeof content !== "string") {
        throw new BadRequestError("Content deve ser do tipo string!");
      }
    }
    const findIdPost = await this.postDatabase.idFindPost(id);
    if (!findIdPost) {
      throw new NotFoundError("Id não localizado!");
    }

    const findUserPost = await this.userDatabase.findUserById(
      findIdPost.creator_id
    );
    if (!findUserPost) {
      throw new NotFoundError("Usuário não localizado!");
    }

    const post = new Post(
      findIdPost.id,
      findIdPost.content,
      findIdPost.likes,
      findIdPost.dislikes,
      findIdPost.created_at,
      findIdPost.updated_at,
      findIdPost.creator_id,
      findUserPost.name
    );
    id && post.setId(id);
    content && post.setContent(content);
    post.setUpdatedAt(new Date().toISOString());

    const postEdit: PostDB = {
      id: post.getId(),
      creator_id: post.getCreatorId(),
      content: post.getContent(),
      likes: post.getLikes(),
      dislikes: post.getDislikes(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt(),
    };

    await this.postDatabase.editPost(postEdit);

    const output: EditPostOutputDTO = {
      message: "Post editado com sucesso!",
      content: post.getContent(),
    };
    return output;
  };

  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { token, id } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }
    const findIdPost = await this.postDatabase.idFindPost(id);
    if (!findIdPost) {
      throw new NotFoundError("Id não localizado!");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== findIdPost.creator_id) {
        throw new ForbiddenError("Apenas quem criou o post, pode deleta-lo!");
      }
    }

    await this.postDatabase.deletePost(id);

    const output: DeletePostOutputDTO = {
      message: " Post deletado com sucesso!",
    };
    return output;
  };

  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { postId, token, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError("Usuário não autenticado!");
    }
    const postDBWithCreatorName =
      await this.postDatabase.findPostWithCreatorNameById(postId);

    if (!postDBWithCreatorName) {
      throw new NotFoundError("Não existe post com essa Id!");
    }
    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes,
      postDBWithCreatorName.dislikes,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.updated_at,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_name
    );

    // const likeSQLite = like ? 1 : 0;

    const likesDislikesDB: LikesDislikesDB = {
      user_id: payload.id,
      post_id: postId,
      like: like ? 1 : 0,
    };

    const likesDislikesExists = await this.postDatabase.findLikeDislike(
      likesDislikesDB
    );

    if (likesDislikesExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeDislike(likesDislikesDB);
        post.removeLikes();
      } else {
        await this.postDatabase.updateLikeDislike(likesDislikesDB);
        post.removeLikes();
        post.addDislikes();
      }
    } else if (likesDislikesExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.removeLikeDislike(likesDislikesDB);
        post.removeDisLikes();
      } else {
        await this.postDatabase.updateLikeDislike(likesDislikesDB);
        post.removeDisLikes();
        post.addLikes();
      }
    } else {
      await this.postDatabase.insertLikesDislikes(likesDislikesDB);
      like ? post.addLikes() : post.addDislikes();
    }
    const updatedPostDB = post.toPostDB();
    await this.postDatabase.editPost(updatedPostDB);

    const output: LikeOrDislikePostOutputDTO = undefined;
    return output;
  };
}
