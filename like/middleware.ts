import type {Request, Response, NextFunction} from "express";
import FreetCollection from "../freet/collection";
import CommentCollection from "../comment/collection";
import SharedFreetCollection from "../shared_freet/collection";
import LikeCollection from "./collection";
import {Types} from "mongoose";

/**
 * Checks if parent content exists
 */
export const doesParentContentExist = (reqInfoType: "body" | "query") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parentIdToCheck = req[reqInfoType].parentContentId as string;
    const freetCheck = await FreetCollection.findById(parentIdToCheck);
    const commentCheck = await CommentCollection.findById(parentIdToCheck);
    const sharedFreetCheck = await SharedFreetCollection.findById(parentIdToCheck);
    if (!freetCheck && !commentCheck && !sharedFreetCheck) {
      return res.status(404).json({message: 'Parent content does not exist.'});
    }

    next();
  };
};

/**
 * Check if duplicate like exists
 */
export const doesDuplicateLikeExist = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {parentContentId} = req.body;
    const doesLikeExist = await LikeCollection.findByUserId(req.session.userId, parentContentId);
    if (doesLikeExist) {
      return res.status(404).json({ message: 'User has already liked this item.'});
    }

    next();
  };
};

/**
 * Checks if the type of the parent content is a freet or comment
 */
export const isParentContentTypeValid = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parentContentTypeToCheck = req.body.parentContentType as string;
    if (parentContentTypeToCheck !== "freet" && parentContentTypeToCheck !== "comment" && parentContentTypeToCheck !== "shared_freet") {
      return res.status(400).json({message: "Parent is not a freet, a comment, or a shared freet. Parent content type is invalid."});
    }

    next();
  };
};

/**
 * Checks if params are given
 */
 export const isParamsGiven = (reqInfoType: "query" | "body" | "params") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = (req[reqInfoType]).parentContentId;
    if (!info) {
      return res.status(400).json({message: "Required parentContentId not given.",});
    }
    next();
  };
};

/**
 * Check if mongo ids are valid
 */
 export const isParamsIdValid = (reqInfoType: "query" | "body" | "params"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = (req[reqInfoType]).parentContentId;
    if (!Types.ObjectId.isValid(info)) {
      return res.status(400).json({message: 'Invalid id for a Mongo object.',});
    }
    next();
  };
};