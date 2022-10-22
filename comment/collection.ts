import FreetCollection from "../freet/collection";
import SharedFreetCollection from "../shared_freet/collection";
import CommunityScoreCollection from "../community_score/collection";
import type {HydratedDocument, Types} from "mongoose";
import type {Comment} from "./model";
import CommentModel from "./model";

export type DeleteManyHelper = {
  authorId?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  parentContentId?: Types.ObjectId | string;
};

class CommentCollection {
  /**
   * Add a comment to the collection
   *
   * @param {string} authorId - author id
   * @param {string} parentContentId - content id
   * @param {'freet' | 'comment' | 'shared_freet'} parentContentType - content type
   * @param {string} content - content
   * @return {Promise<HydratedDocument<Comment>>} - new comment
   */
  static async addOne(authorId: Types.ObjectId | string, parentContentId: Types.ObjectId | string, parentContentType: "freet" | "comment" | "shared_freet", content: string
): Promise<HydratedDocument<Comment>> {
    const comment = new CommentModel({
      authorId, parentContentId, parentContentType, dateCreated: new Date(),
      content, likes: 0, reports: 0,
    });
    await comment.save();
    if (parentContentType === "freet") {
      FreetCollection.updateCounts(parentContentId, "comments", 1);
    }
    else if (parentContentType === "shared_freet") {
      SharedFreetCollection.updateCounts(parentContentId, "comments", 1);
    }
    await CommunityScoreCollection.updateOne(authorId, true, content);
    return comment.populate("authorId");
  }

  /**
   * Update comment likes and reports counts
   *
   * @param commentId - comment id
   * @param count
   * @param change
   */
  static async updateCounts(commentId: Types.ObjectId | string, count: "likes" | "reports", change: number
  ): Promise<void> {
    const comment = await CommentModel.findById(commentId);
    comment[count] += change;
    await comment.save();
  }

  /**
   * Get all the comments for a comment
   *
   * @param {string} commentId - comment id
   *
   * @return {Promise<HydratedDocument<Comment>> | null} - array of comments
   */
   static async findById(commentId: Types.ObjectId | string
  ): Promise<HydratedDocument<Comment>> {
    return CommentModel.findById(commentId).populate("authorId");
  }

  /**
   * Get all the comments for a piece of content
   *
   * @param {string} parentContentId - content id
   *
   * @return {Promise<HydratedDocument<Comment>[]>} - array of comments
   */
  static async findByParentContentId(parentContentId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Comment>>> {
    return CommentModel.find({parentContentId}).sort({ dateCreated: -1 }).populate("authorId");
  }

  /**
   * Delete a comment 
   *
   * @param {string} commentId - comment id
   * @return {Promise<Boolean>} - whether or not the comment has been deleted
   */
  static async deleteOne(commentId: Types.ObjectId | string): Promise<boolean> {
    const deletedComment = await CommentModel.findOneAndDelete({_id: commentId,});
    const parentContentType = deletedComment?.parentContentType;
    if (parentContentType === "freet") {
      FreetCollection.updateCounts(deletedComment.parentContentId, "comments", -1);
    }
    else if (parentContentType === "shared_freet") {
      SharedFreetCollection.updateCounts(deletedComment.parentContentId, "comments", -1);
    }
    deletedComment && (await CommunityScoreCollection.updateOne(deletedComment.authorId, false, deletedComment.content));
    return deletedComment !== null;
  }

  /**
   * Delete many comments
   */
  static async deleteMany(filter: DeleteManyHelper): Promise<void> {
    await CommentModel.deleteMany(filter);
  }

}

export default CommentCollection;
