import type {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import FollowerCollection from "./collection";

/**
 * Check if Follower entry already exists
 */
export const doesFollowExist = async (req: Request, res: Response, next: NextFunction) => {
  const {userFollowed} = req.body;
  const follower = req.session.userId;
  const validContentFormat = Types.ObjectId.isValid(follower) && Types.ObjectId.isValid(userFollowed);
  const doesEntryExist = await FollowerCollection.doesFollowExist(follower, userFollowed);
  if (!validContentFormat || doesEntryExist) {
    return res.status(404).json({error: {followerExists: "This follower entry is invalid or already exists."},});
  }

  next();
};

/**
 * Check if userId is given
 */
 export const isParamsGiven = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = req.query.userId;
    if (!info) {
      return res.status(400).json({message: 'userId is not given.',});
    }
    next();
  };
};



