import type {HydratedDocument, Types} from "mongoose";
import type {CredibilityCount} from "./model";
import CredibilityCountModel from "./model";
import {getCredibilityLevel} from "./util";

class CredibilityCountCollection {
  /**
   * Add a CredibilityCount to the collection
   *
   * @param {string} userId - user id
   * @return {Promise<HydratedDocument<CredibilityCount>>} - new CredibilityCount
   */
  static async addOne(userId: Types.ObjectId | string
  ): Promise<HydratedDocument<CredibilityCount>> {
    const CredibilityCount = new CredibilityCountModel({userId, score: 0, level: 1});
    await CredibilityCount.save();
    return CredibilityCount.populate("userId");
  }

  /**
   * Get credibility count for user
   *
   * @param {string} userId - user id
   *
   * @return {Promise<HydratedDocument<CredibilityCount>[]>}
   */
  static async findByUserId(userId: Types.ObjectId | string
  ): Promise<HydratedDocument<CredibilityCount>> {
    return CredibilityCountModel.findOne({userId}).populate("userId");
  }

  /**
   * Delete credibility count of user
   *
   * @param {string} userId - user id
   * @return {Promise<Boolean>} - whether or not the CredibilityCount has been deleted
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const deletedCredibilityCount = await CredibilityCountModel.deleteOne({userId});
    return deletedCredibilityCount !== null;
  }

  /**
   * Update credibility count of user
   *
   * @param userId - user id
   * @param isNew - whether or not the source is new
   * @param content - content
   */
  static async updateOne(userId: Types.ObjectId | string, isNew: boolean
  ): Promise<HydratedDocument<CredibilityCount>> {
    const credibilityCount = await CredibilityCountModel.findOne({userId});

    if (isNew){
      credibilityCount.score = credibilityCount.score + 1;
    }
    else{
      credibilityCount.score = Math.max(credibilityCount.score - 1, 0);
    }

    const newLevel = getCredibilityLevel(credibilityCount.score);
    credibilityCount.level = newLevel;
    
    await credibilityCount.save();
    return credibilityCount;
  }
}

export default CredibilityCountCollection;
