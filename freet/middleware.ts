import type {Request, Response, NextFunction} from "express";
import {Types} from "mongoose";
import FreetCollection from "../freet/collection";

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat
    ? await FreetCollection.findOne(req.params.freetId)
    : "";
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`,
      },
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
 const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};


/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: "Cannot modify other users' freets.",
    });
    return;
  }

  next();
};


/**
 * Checks if the freet is editable
 * 
 * The levenshtein part of this method was heavily inspired by:
 * https://www.npmjs.com/package/edit-distance
 */
 const isValidFreetEdit = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  
  const createdDate = freet.dateCreated;
  const currDate = new Date();
  
  const numOfHours = 4;
  const createdDateCopy = new Date(createdDate.getTime());
  createdDateCopy.setTime(createdDateCopy.getTime() + numOfHours * 60 * 60 * 1000);

  const newContent = req.body.content;
  const oldContent = freet.content;
  const numCharsChanged = freet.numCharsChanged;

  var ed = require('edit-distance');
  var insert, remove, update;
  insert = remove = function(string1: string) {return 1;};
  update = function(string1: string, string2: string) {return string1 !== string2 ? 1 : 0;};
  
  var lev = ed.levenshtein(oldContent, newContent, insert, remove, update);

  if ((currDate > createdDateCopy) || (lev.distance + numCharsChanged > 10)) {
    res.status(413).json({
      error: "Cannot modify freets more than an edit distance of 10 or more than 4 hours after they are published.",
    });
    return;
  }

  next();
}; 

export {isFreetExists, isValidFreetContent, isValidFreetModifier, isValidFreetEdit};
