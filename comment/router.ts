import type {NextFunction, Request, Response} from "express";
import express from "express";
import CommentCollection from "./collection";
import FreetCollection from "../freet/collection";
import * as userValidator from "../user/middleware";
import * as util from "./util";
import * as commentValidator from "./middleware";
import LikeCollection from "../like/collection";
import ReportCollection from "../report/collection";

const router = express.Router();

/**
 * Get comments of a piece of content
 *
 * @name GET /api/comments?parentContentId=id
 *
 */
router.get(
  "/",
  [commentValidator.isParamsGiven("query", "parentContentId"), commentValidator.isParamsIdValid("query", "parentContentId")],
  async (req: Request, res: Response, next: NextFunction) => {
    const comments = await CommentCollection.findByParentContentId(req.query.parentContentId as string);
    const response = comments.map(util.constructCommentResponse);
    return res.status(200).json(response);
  }
);

/**
 * Create a comment.
 *
 * @name POST /api/comments
 *
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn, commentValidator.isValidContent, commentValidator.isValidParentContentType(), commentValidator.doesParentContentExist(),
    commentValidator.isParamsGiven("body", "parentContentId"), commentValidator.isParamsIdValid("body", "parentContentId")
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? "";
    const {parentContentId, parentContentType, content} = req.body;
    const comment = await CommentCollection.addOne(userId, parentContentId, parentContentType, content);

    res.status(201).json({message: "Your comment was created.", comment: util.constructCommentResponse(comment)});
  }
);

/**
 * Delete a comment.
 *
 * @name DELETE /api/comments/:id
 *
 */
router.delete(
  "/:commentId?",
  [
    userValidator.isUserLoggedIn, commentValidator.doesCommentExist, commentValidator.canChangeComment,
    commentValidator.isParamsGiven("params", "commentId"), commentValidator.isParamsIdValid("params", "commentId")
  ],
  async (req: Request, res: Response) => {
    const {commentId} = req.params;
    await CommentCollection.deleteOne(req.params.commentId);
    const filter = {parentContentId: commentId};
    await CommentCollection.deleteMany(filter);
    await LikeCollection.deleteMany(filter);
    await ReportCollection.deleteMany(filter);
    res.status(200).json({message: "Your comment was deleted.",});
  }
);

export {router as commentRouter};
