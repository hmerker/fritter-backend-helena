import {HydratedDocument, Types} from "mongoose";
import {CommunityScore} from "./model";

type ScoreResponse = {
  score: number;
  userId: Types.ObjectId | string;
};

/**
 * Get community score response
 */
export const constructScoreResponse = (score: HydratedDocument<CommunityScore>
): ScoreResponse => {
  const {_id: userId} = score.userId;
  return {userId, score: score.score,};
};

/**
 * Calculate community score for a piece of content
 *
 * @param content
 * @returns score
 */
export const getContentCommunityScore = (content: string): number => {
  // TODO
  return 10;
};

