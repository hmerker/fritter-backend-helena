import type {NextFunction, Request, Response} from "express";
import express from "express";
import SharedFreetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as sharedFreetValidator from "./middleware";
import * as util from "./util";
import UserCollection from "../user/collection";
import CommentCollection from "../comment/collection";
import LikeCollection from "../like/collection";
import ReportCollection from "../report/collection";
import {Types} from "mongoose";

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/sharedFreets
 *
 * @return {SharedFreetResponse[]} - A list of all the shared freets sorted in descending
 *                      order by date modified
 */
/**
 * Get shared freets by author.
 *
 * @name GET /api/sharedFreets?authorId=id
 *
 * @return {SharedFreetResponse[]} - An array of shared freets where an author is user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await SharedFreetCollection.findAll();
    const response = allFreets.map(util.constructSharedFreetResponse);
    res.status(200).json(response);
  },
  [userValidator.isAuthorExists],
  async (req: Request, res: Response) => {
    const authorFreets = await SharedFreetCollection.findAllByUsername(
      req.query.author as string
    );
    const response = authorFreets.map(util.constructSharedFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new shared freet
 *
 * @name POST /api/sharedFreets
 *
 * @param {string} content - The content of the shared freet
 * @return {SharedFreetResponse} - The created shared freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the shared freet content is empty or a stream of empty spaces
 * @throws {413} - If the shared freet content is more than 140 characters long
 */
router.post(
  "/",
  [userValidator.isUserLoggedIn, sharedFreetValidator.isValidFreetContent, sharedFreetValidator.isValidCollaboratingAuthors],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ""; // Will not be an empty string since its validated in isUserLoggedIn
    const collaboratingAuthors = JSON.parse(req.body.collaboratingAuthors);
    let collaboratingAuthorsStr: Array<Types.ObjectId | string> = [];
    for (let user of collaboratingAuthors){
      let currUserId = await UserCollection.findOneByUsername(user);
      if (currUserId !== null){
        collaboratingAuthorsStr.push((currUserId._id).toString());
      }
    }
    const freet = await SharedFreetCollection.addOne(userId, req.body.content, collaboratingAuthorsStr);

    res.status(201).json({
      message: "Your freet was created successfully.",
      freet: util.constructSharedFreetResponse(freet),
    });
  }
);

/**
 * Delete a shared freet
 *
 * @name DELETE /api/sharedFreets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the sharedFreetId is not valid
 */
router.delete(
  "/:sharedFreetId?",
  [
    userValidator.isUserLoggedIn,
    sharedFreetValidator.isFreetExists,
    sharedFreetValidator.isValidFreetCreator,
  ],
  async (req: Request, res: Response) => {
    await SharedFreetCollection.deleteOne(req.params.sharedFreetId);
    const {sharedFreetId} = req.params;
    await CommentCollection.deleteMany({parentContentId: sharedFreetId});
    await LikeCollection.deleteMany({parentContentId: sharedFreetId});
    await ReportCollection.deleteMany({parentContentId: sharedFreetId});
    res.status(200).json({
      message: "Your freet was deleted successfully.",
    });
  }
);

/**
 * Modify a shared freet
 *
 * @name PUT /api/sharedFreets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {SharedFreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the sharedFreetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  "/:sharedFreetId?",
  [
    userValidator.isUserLoggedIn,
    sharedFreetValidator.isFreetExists,
    sharedFreetValidator.isValidFreetModifier,
    sharedFreetValidator.isValidFreetContent,
  ],
  async (req: Request, res: Response) => {
    const sharedFreet = await SharedFreetCollection.updateOne(req.params.sharedFreetId, req.body.content);
    res.status(200).json({
      message: "Your freet was updated successfully.",
      freet: util.constructSharedFreetResponse(sharedFreet),
    });
  }
);

export {router as sharedFreetRouter};
