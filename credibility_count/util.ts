import {HydratedDocument, Types} from "mongoose";
import {CredibilityCount} from "./model";

type CredibilityResponse = {
  userId: Types.ObjectId | string;
  score: number;
  level: number;
};

/**
 * Get credibility count response
 */
export const constructCredibilityResponse = (score: HydratedDocument<CredibilityCount>
): CredibilityResponse => {
  const {_id: userId} = score.userId;
  return {userId, score: score.score, level: score.level};
};

/**
 * Calculate credibility level for user's score on 1-5 scale
 *
 * @param score
 * @returns level
 */
export const getCredibilityLevel = (score: number): number => {
  
  if (score < 20){
    return 1;
  }
  else if (score < 40){
    return 2;
  }
  else if (score < 70){
    return 3;
  }
  else if (score < 100){
    return 4;
  }
  else{
    return 5;
  }

};

