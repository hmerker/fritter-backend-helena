/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-destructuring */
import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userMiddleware from '../user/middleware';
import LikeCollection from './collection';
import * as middleware from './middleware';

const router = express.Router();

/**
 * Check if user has liked an item.
 *
 * @name GET /api/like?itemId=id
 *
 * @return {boolean} - true if user liked item, false otherwise
 * @throws {403} - if user is not logged in
 * @throws {404} - if itemId is invalid
 * @throws {400} - if itemId is not given
 *
 */
router.get(
  '/:itemId?',
  [
    userMiddleware.isUserLoggedIn,
    middleware.isItemIdGiven('query'),
    middleware.doesItemIdExist('query')
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const exists = await LikeCollection.findOneByUserId(userId, req.query.itemId as string);
    res.status(200).json({exists});
  }
);

/**
 * Create a like.
 *
 * @name POST /api/likes
 *
 * @return {HydratedDocument<Like>} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} - if itemId does not exist
 * @throws {404} - if the itemId has already been liked
 */
router.post(
  '/',
  [
    userMiddleware.isUserLoggedIn,
    middleware.doesItemIdExist('body'),
    middleware.alreadyLiked
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {itemId} = req.body;
    const like = await LikeCollection.addOne(userId, itemId);
    res.status(201).json({message: 'You liked the item.', like});
  }
);

/**
 * Delete a like.
 *
 * @name DELETE /api/likes/:itemId
 *
 * @throws {403} - if user is not logged in
 * @throws {404} - if itemId is invalid
 * @throws {400} - if itemId is not given
 */
router.delete(
  '/:itemId?',
  [
    userMiddleware.isUserLoggedIn,
    middleware.isItemIdGiven('params')
  ],
  async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const userId = req.session.userId as string;
    await LikeCollection.deleteOne(userId, itemId);
    res.status(200).json({message: 'Your like was deleted.'});
  }
);

export {router as likeRouter};
