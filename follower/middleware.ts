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
 * Checks if params are given
 */
 export const isParamsGiven = (reqInfoType: "query" | "body" | "params", field: "userId" | "userFollowed") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = (req[reqInfoType])[field];
    if (!info) {
      return res.status(400).json({message: "Required id of item (userId or userFollowed) not given."});
    }
    next();
  };
};

/**
 * Check if mongo ids are valid
 */
 export const isParamsIdValid = (reqInfoType: "query" | "body" | "params", field: "userId" | "userFollowed"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = (req[reqInfoType])[field];
    if (!Types.ObjectId.isValid(info)) {
      return res.status(400).json({message: 'Invalid id for a Mongo object.'});
    }
    next();
  };
};



