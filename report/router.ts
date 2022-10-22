import type { NextFunction, Request, Response } from "express";
import express from "express";
import * as userValidator from "../user/middleware";
import ReportCollection from "./collection";
import * as reportValidator from "./middleware";

const router = express.Router();

/**
 * Check if user has reported content
 *
 * @name GET /api/reports?parentContentId=id
 *
 */
router.get(
  "/:parentContentId?",
  [
    userValidator.isUserLoggedIn, reportValidator.isParamsGiven("query"), reportValidator.isParamsIdValid("query"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.userId as string;
    const doesExist = await ReportCollection.findByUserId(userId, req.query.parentContentId as string);
    res.status(200).json({doesExist});
  }
);

/**
 * Create report
 *
 * @name POST /api/report
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn, reportValidator.isParamsGiven("body"), reportValidator.isParamsIdValid("body"),
    reportValidator.doesDuplicateReportExist(), reportValidator.isValidContent,
    reportValidator.isParentContentTypeValid(), reportValidator.doesParentContentExist("body"),

  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {parentContentId, parentContentType, content} = req.body;
    const newReport = await ReportCollection.addOne(userId, parentContentId, parentContentType, content);
    res.status(201).json({message: "You reported the content successfully.", newReport});
  }
);

/**
 * Delete report
 *
 * @name DELETE /api/reports/:id
 */
router.delete(
  "/:parentContentId?",
  [
    userValidator.isUserLoggedIn, reportValidator.isParamsGiven("params"),
    reportValidator.isParamsIdValid("body"),
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const parentContentId = req.params.parentContentId;
    await ReportCollection.deleteOne(userId, parentContentId);
    res.status(200).json({message: "Your report was deleted successfully."});
  }
);

export {router as reportRouter};
