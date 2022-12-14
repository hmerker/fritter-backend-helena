import type {Types, PopulatedDoc, Document} from "mongoose";
import {Schema, model} from "mongoose";
import type {User} from "../user/model";

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type SharedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  comments: number;
  likes: number;
  reports: number;
  collaboratingAuthors: Array<Types.ObjectId>;
};

export type PopulatedSharedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  comments: number;
  likes: number;
  reports: number;
  collaboratingAuthors: Array<User>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const SharedFreetSchema = new Schema<SharedFreet>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // The content of the freet
  content: {
    type: String,
    required: true,
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true,
  },
  comments: {
    type: Number,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  reports: {
    type: Number,
    required: true,
  },
  collaboratingAuthors: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }]
});

const SharedFreetModel = model<SharedFreet>("SharedFreet", SharedFreetSchema);
export default SharedFreetModel;
