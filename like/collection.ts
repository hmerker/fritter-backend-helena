import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import FreetCollection from '../freet/collection';

class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} userId - user id
   * @param {string} itemId - item id
   * @return {Promise<HydratedDocument<Like>>}
   */
  static async addOne(userId: Types.ObjectId | string, itemId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      userId,
      itemId
    });
    await FreetCollection.changeCounts(itemId, 'likes', 1);
    await like.save();
    return like.populate('userId');
  }

  /**
   * Find whether a user has liked an item
   *
   * @param {string} userId - user id
   * @param {string} itemId - item id
   *
   * @return {Promise<boolean>}
   */
  static async findOneByUserId(userId: Types.ObjectId | string, itemId: Types.ObjectId | string): Promise<boolean> {
    return (await LikeModel.findOne({userId, itemId})) !== null;
  }

  /**
   * Delete a like
   *
   * @param {string} userId - user id
   * @param {string} parentId - like id
   * @return {Promise<Boolean>}
   */
  static async deleteOne(userId: Types.ObjectId | string, itemId: Types.ObjectId | string): Promise<boolean> {
    const deletedLike = await LikeModel.findOneAndDelete({userId, itemId});
    await FreetCollection.changeCounts(deletedLike.itemId, 'likes', -1);
    return deletedLike !== null;
  }

  /**
   * Delete a user's like entries
   *
   * @returns true if deletion was successful, otherwise false
   */
  static async deleteMany(itemId: Types.ObjectId | string): Promise<boolean> {
    const deleted = await LikeModel.deleteMany({itemId});
    return deleted !== null;
  }
}

export default LikeCollection;
