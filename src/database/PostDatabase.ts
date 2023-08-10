import {
  LikesDislikesDB,
  POST_LIKE,
  PostDB,
  PostDBWithCreatorByName,
} from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES: "likes_dislikes";

  public async getAllPosts(): Promise<PostDB[]> {
    const response: PostDB[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).select();
    return response;
  }

  public async insertPost(postDB: PostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(postDB);
  }

  public async editPost(postDB: PostDB): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id: postDB.id });
  }

  public async idFindPost(id: string): Promise<PostDB | undefined> {
    const postDBExists: PostDB[] = await BaseDatabase.connection(
      PostDatabase.TABLE_POSTS
    ).where({ id });
    return postDBExists[0];
  }

  public async deletePost(id: string): Promise<void> {
    await BaseDatabase.connection(PostDatabase.TABLE_POSTS).where({ id }).del();
  }

  public findPostWithCreatorNameById = async (
    id: string
  ): Promise<PostDBWithCreatorByName | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.name as creator_name`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id });
    return result as PostDBWithCreatorByName | undefined;
  };
  public findLikeDislike = async (
    likesDislikesDB: LikesDislikesDB
  ): Promise<POST_LIKE | undefined> => {
    const [result]: Array<POST_LIKE | undefined> =
      await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .select()
        .where({
          user_id: likesDislikesDB.user_id,
          post_id: likesDislikesDB.post_id,
        });
    return result;
  };

  public removeLikeDislike = async (
    likesDislikesDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likesDislikesDB.user_id,
        post_id: likesDislikesDB.post_id,
      });
  };

  public updateLikeDislike = async (
    likesDislikesDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likesDislikesDB)
      .where({
        user_id: likesDislikesDB.user_id,
        post_id: likesDislikesDB.post_id,
      });
  };

  public insertLikesDislikes = async (
    likesDislikesDB: LikesDislikesDB
  ): Promise<void> => {
    await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
      likesDislikesDB
    );
  };
}
