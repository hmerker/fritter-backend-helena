import type {HydratedDocument, Types} from "mongoose";
import type {Report} from "./model";
import ReportModel from "./model";
import FreetCollection from "../freet/collection";
import SharedFreetCollection from "../shared_freet/collection";
import CommentCollection from "../comment/collection";

export type DeleteManyHelper = {
  authorId?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  parentContentId?: Types.ObjectId | string;
};

class ReportCollection {
  /**
   * Add a Report to the collection
   *
   * @param {string} userId - user id
   * @param {string} parentContentId - parent content id
   * @param {string} parentContentType - parent content type
   * @param {string} content - content 
   * @return {Promise<HydratedDocument<Report>>} - new report
   */
  static async addOne(userId: Types.ObjectId | string, parentContentId: Types.ObjectId | string, parentContentType: "freet" | "comment" | "shared_freet", content: string
  ): Promise<HydratedDocument<Report>> {
    const report = new ReportModel({userId, parentContentId, parentContentType, content});
    if (parentContentType === "freet"){
      FreetCollection.updateCounts(parentContentId, "reports", 1);
    }
    else if (parentContentType === "comment"){
      CommentCollection.updateCounts(parentContentId, "reports", 1);
    }
    else if (parentContentType === "shared_freet"){
      SharedFreetCollection.updateCounts(parentContentId, "reports", 1);
    }
    await report.save();
    return report.populate("userId");
  }

  /**
   * Get if user has reported content
   *
   * @param {string} userId - user id
   * @param {string} parentContentId - parent content id
   *
   * @return {Promise<boolean>}
   */
  static async findByUserId(userId: Types.ObjectId | string, parentContentId: Types.ObjectId | string
  ): Promise<boolean> {
    return (await ReportModel.findOne({userId, parentContentId})) !== null;
  }

  /**
   * Delete report
   *
   * @param {string} userId - user id
   * @param {string} parentContentId - parent id
   * @return {Promise<Boolean>} - whether or not the report has been deleted
   */
  static async deleteOne(userId: Types.ObjectId | string, parentContentId: Types.ObjectId | string
): Promise<boolean> {
    const deletedReport = await ReportModel.findOneAndDelete({userId, parentContentId});
    if (deletedReport.parentContentType === "freet"){
      deletedReport !== null && FreetCollection.updateCounts(deletedReport.parentContentId, "reports", -1);
    }
    else if (deletedReport.parentContentType === "comment"){
      deletedReport !== null && CommentCollection.updateCounts(deletedReport.parentContentId, "reports", -1);
    }
    else if (deletedReport.parentContentType === "shared_freet"){
      deletedReport !== null && SharedFreetCollection.updateCounts(deletedReport.parentContentId, "reports", -1);
    }
    return deletedReport !== null;
  }

  /**
   * Delete many report entries
   */
  static async deleteMany(filter: DeleteManyHelper): Promise<boolean> {
    const deleted = await ReportModel.deleteMany(filter);
    return deleted !== null;
  }
}

export default ReportCollection;
