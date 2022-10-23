import type {NextFunction, Request, Response} from "express";
import express from "express";
import CredibilityCountCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as util from "./util";

const router = express.Router();

router.get(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    return res.status(200).json(util.constructCredibilityResponse(await CredibilityCountCollection.findByUserId(userId)));
  }
);

export {router as credibilityCountRouter};
