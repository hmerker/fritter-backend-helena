import type {Request, Response, NextFunction} from "express";
import FreetCollection from "../freet/collection";
import CommentCollection from "../comment/collection";
import LikeCollection from "../like/collection";

/**
 * Check if parentContentId is given
 */
export const isParamGiven = (reqInfoType: "params" | "query") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = req[reqInfoType].parentContentId;
    if (!info) {
    return res.status(400).json({message: 'Required information not given.',});
    }
    
    next();
  };
};

/**
 * Checks if parent content exists
 */
export const doesParentContentExist = (reqInfoType: "body" | "query") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parentIdToCheck = req[reqInfoType].parentContentId as string;
    const freetCheck = FreetCollection.findById(parentIdToCheck);
    const commentCheck = CommentCollection.findById(parentIdToCheck);
    if (!freetCheck && !commentCheck) {
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
    if (parentContentTypeToCheck !== "freet" && parentContentTypeToCheck !== "comment") {
      return res.status(400).json({message: "Parent is not a freet or a comment."});
    }

    next();
  };
};