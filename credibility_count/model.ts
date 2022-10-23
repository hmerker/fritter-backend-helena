import type {Types} from "mongoose";
import {Schema, model} from "mongoose";
import type {User} from "../user/model";

export type CredibilityCount = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  score: number;
  level: number;
};

export type PopulatedCredibilityCount = {
  _id: Types.ObjectId;
  userId: User;
  score: number;
  level: number;
};

const CredibilityCountSchema = new Schema<CredibilityCount>({
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  score: {
    type: Number,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
});

export default model<CredibilityCount>("CredibilityCount", CredibilityCountSchema);
