import type {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import CommentCollection from "./collection";
import FreetCollection from "../freet/collection";
import SharedFreetCollection from "../shared_freet/collection";

/**
 * Checks if the comment exists
 */
export const doesCommentExist = async (req: Request, res: Response, next: NextFunction) => {
  const {commentId} = req.params;
  const isCommentFormatValid = Types.ObjectId.isValid(commentId);
  const commentFound = isCommentFormatValid ? await CommentCollection.findById(commentId) : "";
  if (!commentFound) {
    return res.status(404).json({error: {commentNotFound: 'Comment does not exist.',},});
  }

  next();
};

/**
 * Checks if user of current session is author of comment
 */
export const canChangeComment = async (req: Request, res: Response, next: NextFunction) => {
  const commentFound = await CommentCollection.findById(req.params.commentId);
  const userId = commentFound.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({error: "You are not the author of this comment.",});
    return;
  }

  next();
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

/**
 * Checks if parentContentType is valid
 */
export const isValidParentContentType = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const parentContentType = req.body.parentContentType as string;
    if (parentContentType !== "freet" && parentContentType !== "comment" && parentContentType !== "shared_freet") {
      return res.status(400).json({ message: "Comments can only be attatched to freets, shared freets, and other comments. Parent content type is invalid." });
    }
    next();
  };
};

/**
 * Checks if params are given
 */
 export const isParamsGiven = (reqInfoType: "query" | "body" | "params", field: "parentContentId" | "commentId") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = (req[reqInfoType])[field];
    if (!info) {
      return res.status(400).json({message: "Required id of item (parentContentId or commentId) not given.",});
    }
    next();
  };
};

/**
 * Check if mongo ids are valid
 */
 export const isParamsIdValid = (reqInfoType: "query" | "body" | "params", field: "parentContentId" | "commentId"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const info = (req[reqInfoType])[field];
    if (!Types.ObjectId.isValid(info)) {
      return res.status(400).json({message: 'Invalid id for a Mongo object.',});
    }
    next();
  };
};

/**
 * Checks if parent content exists
 */
 export const doesParentContentExist = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req.body.parentContentId as string;
    const freet = await FreetCollection.findById(id);
    const comment = await CommentCollection.findById(id);
    const sharedFreet = await SharedFreetCollection.findById(id);
    if (!freet && !comment && !sharedFreet) {
      return res.status(404).json({ message: 'Parent content does not exist.' });
    }
    next();
  };
};



