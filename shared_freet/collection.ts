import type {HydratedDocument, Types} from "mongoose";
import type {SharedFreet} from "./model";
import SharedFreetModel from "./model";
import UserCollection from "../user/collection";

class SharedFreetCollection {
  /**
   * get a shared freet by id
   *
   * @param sharedFreetId - id of the shared freet
   * @returns the shared freet if it exists; null otherwise
   */
  static async findById(sharedFreetId: Types.ObjectId | string): Promise<HydratedDocument<SharedFreet>> {
    return await SharedFreetModel.findById(sharedFreetId);
  }
  
  /**
   * Add a shared freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @param {Array<Types.ObjectId>} collaboratingAuthors - ids of the collaborating authors
   * @return {Promise<HydratedDocument<SharedFreet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, collaboratingAuthors: Array<Types.ObjectId | string>): Promise<HydratedDocument<SharedFreet>> {
    const date = new Date();
    const sharedFreet = new SharedFreetModel({
      authorId, dateCreated: date, content, dateModified: date,
      comments: 0, likes: 0, reports: 0, collaboratingAuthors
    });
    await sharedFreet.save(); // Saves freet to MongoDB
    return sharedFreet.populate("authorId");
  }

  /**
   * Find a shared freet by sharedFreetId
   *
   * @param {string} sharedFreetId - The id of the shared freet to find
   * @return {Promise<HydratedDocument<SharedFreet>> | Promise<null> } - The shared freet with the given sharedFreetId, if any
   */
  static async findOne(sharedFreetId: Types.ObjectId | string): Promise<HydratedDocument<SharedFreet>> {
    return SharedFreetModel.findOne({_id: sharedFreetId}).populate("authorId");
  }

  /**
   * Get all the shared freets in the database
   *
   * @return {Promise<HydratedDocument<SharedFreet>[]>} - An array of all of the shared freets
   */
  static async findAll(): Promise<Array<HydratedDocument<SharedFreet>>> {
    // Retrieves shared freets and sorts them from most to least recent
    return SharedFreetModel.find({}).sort({dateModified: -1}).populate("authorId");
  }

  /**
   * Get all the shared freets in by given author
   *
   * @param {string} username - The username of author of the shared freets
   * @return {Promise<HydratedDocument<SharedFreet>[]>} - An array of all of the shared freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<SharedFreet>>> {
    const author = await UserCollection.findOneByUsername(username);
    const collaboratingFreets = await SharedFreetModel.find({collaboratingAuthors: author._id},).populate("authorId");
    const mainFreets = await SharedFreetModel.find({authorId: author._id}).populate("authorId");
    return [...collaboratingFreets, ...mainFreets];
  }

  /**
   * Update a shared freet with the new content
   *
   * @param {string} sharedFreetId - The id of the shared freet to be updated
   * @param {string} content - The new content of the shared freet
   * @return {Promise<HydratedDocument<SharedFreet>>} - The newly updated shared freet
   */
  static async updateOne(sharedFreetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<SharedFreet>> {
    const freet = await SharedFreetModel.findOne({_id: sharedFreetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate("authorId");
  }

  /**
   * Delete a shared freet with given sharedFreetId.
   *
   * @param {string} sharedFreetId - The sharedFreetId of shared freet to delete
   * @return {Promise<Boolean>} - true if the shared freet has been deleted, false otherwise
   */
  static async deleteOne(sharedFreetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await SharedFreetModel.findOneAndDelete({_id: sharedFreetId});
    return freet !== null;
  }

  /**
   * Delete all the shared freets by the given author
   * Note that the given author must be the creator of a shared freet (not a collaborating author)
   *
   * @param {string} authorId - The id of author of shared freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await SharedFreetModel.deleteMany({authorId});
  }

  /**
   * Update shared freet comments, likes, and reports counts
   *
   * @param sharedFreetId - id of freet
   * @param count to increment
   * @param change number
   */
  static async updateCounts(sharedFreetId: Types.ObjectId | string, count: "comments" | "likes" | "reports", change: number): Promise<void> {
    const sharedFreet = await SharedFreetModel.findById(sharedFreetId);
    sharedFreet[count] += change;
    await sharedFreet.save();
  }
}

export default SharedFreetCollection;
