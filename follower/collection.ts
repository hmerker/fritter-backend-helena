import type {HydratedDocument, Types} from "mongoose";
import type {Follower} from "./model";
import FollowerModel from "./model";

type FollowCounts = {
  followers: number;
  usersFollowed: number;
};

class FollowerCollection {
  /**
   * Add a Follower to the collection
   *
   * @param {string} userFollowed - user being followed
   * @return {Promise<HydratedDocument<Follower>>} - new Follower
   */
  static async addOne(follower: Types.ObjectId | string, userFollowed: Types.ObjectId | string
  ): Promise<HydratedDocument<Follower>> {
    const Follower = new FollowerModel({follower,userFollowed});
    await Follower.save();
    return (await Follower.populate("follower")).populate("userFollowed");
  }

  /**
   * Get follower counts of user
   *
   * @param {string} userId - user id
   *
   * @return {Promise<FollowCounts>}
   */
  static async getFollowCounts(userId: Types.ObjectId | string
  ): Promise<FollowCounts> {
    const followers = await FollowerModel.find({follower: userId}).count();
    const usersFollowed = await FollowerModel.find({userFollowed: userId}).count();
    return {followers, usersFollowed};
  }

  /**
   * get all users that user follows
   *
   * @param userId - user id
   * @returns users followed list
   */
   static async getUsersFollowedList(userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Follower>>> {
    return FollowerModel.find({follower: userId});
  }

  /**
   * Check if follow already exists
   *
   * @param {string} follower - follower id
   * @param {string} userFollowed - user being followed id
   *
   * @return {Promise<boolean>}
   */
  static async doesFollowExist(follower: Types.ObjectId | string, userFollowed: Types.ObjectId | string
  ): Promise<boolean> {
    return (await FollowerModel.findOne({follower, userFollowed})) !== null;
  }

  /**
   * Delete follower
   *
   * @param {string} userFollowed - id of user being followed
   * @return {Promise<Boolean>} - whether or not the follower was deleted
   */
  static async deleteOne(userFollowed: Types.ObjectId | string): Promise<boolean> {
    const deletedFollower = await FollowerModel.deleteOne({userFollowed});
    return deletedFollower !== null;
  }

  /**
   * Delete follows of user
   *
   * @param userId - user id
   * @returns - whether or not operation was successful
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<boolean> {
    const deletedEntries = await FollowerModel.deleteMany({follower: userId});
    return deletedEntries !== null;
  }
}

export default FollowerCollection;
