import type {NextFunction, Request, Response} from "express";
import express from "express";
import FollowerCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as followerValidator from "./middleware";

const router = express.Router();

router.get(
  "/:userId?",
  [followerValidator.isParamsGiven("query", "userId"), followerValidator.isParamsIdValid("query", "userId")],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.query.userId;
    return res.status(200).json(await FollowerCollection.getFollowCounts(userId as string));
  }
);

router.post(
  "/",
  [userValidator.isUserLoggedIn, followerValidator.doesFollowExist],
  async (req: Request, res: Response, next: NextFunction) => {
    const follower = req.session.userId;
    const {userFollowed} = req.body;
    return res.status(201).json(await FollowerCollection.addOne(follower, userFollowed));
  }
);

router.delete(
  "/:userFollowed",
  [userValidator.isUserLoggedIn, followerValidator.isParamsGiven("params", "userFollowed"), followerValidator.isParamsIdValid("params", "userFollowed")],
  async (req: Request, res: Response, next: NextFunction) => {
    await FollowerCollection.deleteOne(req.params.userFollowed);
    return res.status(200).json({message: "Your follower was deleted.",});
  }
);

export {router as followerRouter};
