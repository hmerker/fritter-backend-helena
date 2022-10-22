import type {Request, Response, NextFunction} from "express";
import FreetCollection from "../freet/collection";
import CommentCollection from "../comment/collection";
import ReportCollection from "./collection";

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
 * Check if duplicate report exists
 */
export const doesDuplicateReportExist = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {parentContentId} = req.body;
    const doesReportExist = await ReportCollection.findByUserId(req.session.userId, parentContentId);
    if (doesReportExist) {
      return res.status(404).json({ message: 'User has already reported this item.'});
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

/**
 * Checks if content is valid
 */
export const isValidContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({error: "Content cannot be empty.",});
    return;
  }

  if (content.length > 140) {
    res.status(413).json({error: "Content cannot be greater than 140 characters.",});
    return;
  }

  next();
};