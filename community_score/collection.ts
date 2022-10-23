import type {HydratedDocument, Types} from "mongoose";
import type {CommunityScore} from "./model";
import CommunityScoreModel from "./model";
import {getContentCommunityScore} from "./util";

class CommunityScoreCollection {
  /**
   * Add a CommunityScore to the collection
   *
   * @param {string} userId - user id
   * @return {Promise<HydratedDocument<CommunityScore>>} - new CommunityScore
   */
  static async addOne(userId: Types.ObjectId | string
  ): Promise<HydratedDocument<CommunityScore>> {
    const CommunityScore = new CommunityScoreModel({userId, score: 0});
    await CommunityScore.save();
    return CommunityScore.populate("userId");
  }

  /**
   * Get community score for user
   *
   * @param {string} userId - user id
   *
   * @return {Promise<HydratedDocument<CommunityScore>[]>}
   */
  static async findByUserId(userId: Types.ObjectId | string
  ): Promise<HydratedDocument<CommunityScore>> {
    return CommunityScoreModel.findOne({userId}).populate("userId");
  }

  /**
   * Delete community score of user
   *
   * @param {string} userId - user id
   * @return {Promise<Boolean>} - whether or not the CommunityScore has been deleted
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const deletedCommunityScore = await CommunityScoreModel.deleteOne({userId});
    return deletedCommunityScore !== null;
  }

  /**
   * Update community score of user
   *
   * @param userId - user id
   * @param isNewContent - whether or not the content is new
   * @param content - content
   */
  static async updateOne(userId: Types.ObjectId | string, isNewContent: boolean, content: string
  ): Promise<HydratedDocument<CommunityScore>> {
    const contentScore = getContentCommunityScore(content);
    const communityScore = await CommunityScoreModel.findOne({userId});

    if (isNewContent){
      communityScore.score = communityScore.score + contentScore;
    }
    else{
      communityScore.score = communityScore.score - contentScore;
    }
    
    await communityScore.save();
    return communityScore;
  }
}

export default CommunityScoreCollection;
