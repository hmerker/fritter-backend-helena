import type {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import SharedFreetCollection from "./collection";
import UserCollection from "../user/collection";

/**
 * Checks if a shared freet with sharedFreetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.sharedFreetId);
  const freet = validFormat
    ? await SharedFreetCollection.findOne(req.params.sharedFreetId)
    : "";
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: "Shared freet does not exist.",
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the shared freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
 const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Shared freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Shared freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};


/**
 * Checks if the current user is one of the authors of the freet whose sharedFreetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await SharedFreetCollection.findOne(req.params.sharedFreetId);
  const userId = freet.authorId._id;
  const collaboratingAuthors = freet.collaboratingAuthors;
  let flag = true;
  for (let user of collaboratingAuthors){
    if (req.session.userId === (user._id).toString()){
      flag = false;
    }
  }
  if (flag && req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' shared freets.",
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose sharedFreetId is in req.params
 */
 const isValidFreetCreator = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await SharedFreetCollection.findOne(req.params.sharedFreetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: "Cannot delete a shared freet unless you are the freet's creator.",
    });
    return;
  }

  next();
};

/**
 * Checks if the collaborating authors are valid usernames
 */
 const isValidCollaboratingAuthors = async (req: Request, res: Response, next: NextFunction) => {
  const collaboratingAuthors = JSON.parse(req.body.collaboratingAuthors);
  let flag = false;
  for (let user of collaboratingAuthors){
    let currUserId = await UserCollection.findOneByUsername(user);
    if (currUserId === null){
      flag = true;
    }
  }
  if (flag === true) {
    res.status(403).json({
      error: "One or more of the usernames in colaboratingAuthors correspond to users that do not exist.",
    });
    return;
  }

  next();
};


export {isFreetExists, isValidFreetContent, isValidFreetModifier, isValidFreetCreator, isValidCollaboratingAuthors};
