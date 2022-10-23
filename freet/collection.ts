import type {HydratedDocument, Types} from "mongoose";
import type {Freet} from "./model";
import FreetModel from "./model";
import UserCollection from "../user/collection";
import CommunityScoreCollection from "../community_score/collection";
import CredibilityCountCollection from "../credibility_count/collection";
import FollowerCollection from "../follower/collection";

class FreetCollection {
  /**
   * get a freet by id
   *
   * @param freetId - id of the freet
   * @returns the freet if it exists; null otherwise
   */
  static async findById(
    freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return await FreetModel.findById(freetId);
  }

  /**
    * Get freets for user's feed
    *
    * @param userId - user id
    * @param mongoFollowerFilter - include or exlcude users followed
    * @returns list of freets
    */
   static async getFreetsForFeed(userId: Types.ObjectId | string, mongoFollowerFilter: "$in" | "$nin"
  ): Promise<Array<HydratedDocument<Freet>>> {
    const followerEntries = await FollowerCollection.getUsersFollowedList(userId);
    const usersFollowed = followerEntries.map((followerEntry) => followerEntry.userFollowed);
    mongoFollowerFilter === "$nin" && usersFollowed.push(userId as Types.ObjectId);
    return await FreetModel.find({authorId: {[mongoFollowerFilter]: usersFollowed}}).populate("authorId");
  }
  
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, source: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId, dateCreated: date, content, dateModified: date,
      comments: 0, likes: 0, reports: 0, source, numCharsChanged: 0
    });
    await freet.save(); // Saves freet to MongoDB
    if (source !== "none"){
      await CredibilityCountCollection.updateOne(authorId, true);
    }
    await CommunityScoreCollection.updateOne(authorId, true, content);
    return freet.populate("authorId");
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({ _id: freetId }).populate("authorId");
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({}).sort({ dateModified: -1 }).populate("authorId");
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).populate("authorId");
  }

  /**
   * Update a freet with the new content
   * 
   * The levenshtein part of this method was heavily inspired by:
   * https://www.npmjs.com/package/edit-distance
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string, source: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});

    const newContent = content;
    const oldContent = freet.content;

    var ed = require('edit-distance');
    var insert, remove, update;
    insert = remove = function(string1: string) {return 1;};
    update = function(string1: string, string2: string) {return string1 !== string2 ? 1 : 0;};
  
    var lev = ed.levenshtein(oldContent, newContent, insert, remove, update);
    freet.numCharsChanged = freet.numCharsChanged + lev.distance;

    freet.content = content;
    if (source !== "none"){
      freet.source = source;
    }
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate("authorId");
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freetToDelete = await FreetModel.findOne({_id: freetId});
    if (freetToDelete.source !== "none"){
      await CredibilityCountCollection.updateOne(freetToDelete.authorId, false)
    }
    const freet = await FreetModel.findOneAndDelete({_id: freetId});
    freet && (await CommunityScoreCollection.updateOne(freet.authorId, false, freet.content));
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }

  /**
   * Update freet comments, likes, and reports counts
   *
   * @param freetId - id of freet
   * @param count to increment
   * @param change number
   */
  static async updateCounts(freetId: Types.ObjectId | string, count: "comments" | "likes" | "reports", change: number): Promise<void> {
    const freet = await FreetModel.findById(freetId);
    freet[count] += change;
    await freet.save();
  }
}

export default FreetCollection;
