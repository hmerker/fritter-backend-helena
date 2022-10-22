import type {NextFunction, Request, Response} from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import LikeCollection from "./collection";
import * as likeValidator from "./middleware";

const router = express.Router();

/**
 * Check if user has liked content
 *
 * @name GET /api/likes?parentContentId=id
 */
router.get(
  "/:parentContentId?",
  [
    userValidator.isUserLoggedIn, likeValidator.isParamsGiven("query"), likeValidator.isParamsIdValid("query")
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const doesExist = await LikeCollection.findByUserId(userId, req.query.parentContentId as string);
    res.status(200).json({doesExist});
  }
);

/**
 * Create like
 *
 * @name POST /api/likes
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn, likeValidator.isParamsGiven("body"),
    likeValidator.isParamsIdValid("body"), likeValidator.doesDuplicateLikeExist(), 
    likeValidator.isParentContentTypeValid(), likeValidator.doesParentContentExist("body"),
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {parentContentId, parentContentType} = req.body;
    const newLike = await LikeCollection.addOne(userId, parentContentId, parentContentType);
    res.status(201).json({message: "You liked the content successfully.", newLike});
  }
);

/**
 * Delete like
 *
 * @name DELETE /api/likes/:id
 */
router.delete(
  "/:parentContentId?",
  [
    userValidator.isUserLoggedIn, likeValidator.isParamsGiven("params"), likeValidator.isParamsIdValid("params"),
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const parentContentId = req.params.parentContentId;
    await LikeCollection.deleteOne(userId, parentContentId);
    res.status(200).json({message: "Your like was deleted successfully.",});
  }
);

export {router as likeRouter};
