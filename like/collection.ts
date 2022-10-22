import type {HydratedDocument, Types} from "mongoose";
import type {Like} from "./model";
import LikeModel from "./model";
import CommentCollection from "../comment/collection";
import FreetCollection from "../freet/collection";
import SharedFreetCollection from "../shared_freet/collection";

export type DeleteManyHelper = {
  authorId?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  parentContentId?: Types.ObjectId | string;
};

class LikeCollection {
  /**
   * Add a Like
   *
   * @param {string} userId - user id
   * @param {string} parentContentId - parent id
   * @param {string} parentContentType - freet or comment
   * @return {Promise<HydratedDocument<Like>>} - new like
   */
  static async addOne(userId: Types.ObjectId | string, parentContentId: Types.ObjectId | string, parentContentType: "freet" | "comment" | "shared_freet"
  ): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({userId, parentContentId, parentContentType,});
    if (parentContentType === "freet"){
      FreetCollection.updateCounts(parentContentId, "likes", 1);
    }
    else if (parentContentType === "comment"){
      CommentCollection.updateCounts(parentContentId, "likes", 1);
    }
    else if (parentContentType === "shared_freet"){
      SharedFreetCollection.updateCounts(parentContentId, "likes", 1);
    }
    await like.save();
    return like.populate("userId");
  }

  /**
   * Get if user has liked content
   *
   * @param {string} userId - user id
   * @param {string} parentContentId - content id
   *
   * @return {Promise<boolean>}
   */
  static async findByUserId(userId: Types.ObjectId | string, parentContentId: Types.ObjectId | string
  ): Promise<boolean> {
    return (await LikeModel.findOne({userId, parentContentId})) !== null;
  }

  /**
   * Delete like
   *
   * @param {string} userId - user if
   * @param {string} parentContentId - content if
   * @return {Promise<Boolean>} - whether or not the like has been deleted
   */
  static async deleteOne(userId: Types.ObjectId | string, parentContentId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedLike = await LikeModel.findOneAndDelete({userId,parentContentId});
    if (deletedLike.parentContentType === "freet"){
      deletedLike !== null && FreetCollection.updateCounts(deletedLike.parentContentId, "likes", -1);
    }
    else if (deletedLike.parentContentType === "comment"){
      deletedLike !== null && CommentCollection.updateCounts(deletedLike.parentContentId, "likes", -1);
    }
    else if (deletedLike.parentContentType === "shared_freet"){
      deletedLike !== null && SharedFreetCollection.updateCounts(deletedLike.parentContentId, "likes", -1);
    }
    return deletedLike !== null;
  }

  /**
   * Delete many like entries
   */
  static async deleteMany(filter: DeleteManyHelper): Promise<boolean> {
    const deleted = await LikeModel.deleteMany(filter);
    return deleted !== null;
  }
}

export default LikeCollection;
