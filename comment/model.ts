import type {Types} from "mongoose";
import {Schema, model} from "mongoose";
import type {User} from "../user/model";

export type Comment = {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  parentContentId: Types.ObjectId;
  parentContentType: "freet" | "comment" | "shared_freet";
  dateCreated: Date;
  content: string;
  likes: number;
  reports: number;
};

export type PopulatedComment = {
  _id: Types.ObjectId;
  authorId: User;
  parentContentId: Types.ObjectId;
  parentContentType: "freet" | "comment" |  "shared_freet";
  dateCreated: Date;
  content: string;
  likes: number;
  reports: number;
};

const CommentSchema = new Schema<Comment>({
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  parentContentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
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
});

export default model<Comment>("Comment", CommentSchema);
