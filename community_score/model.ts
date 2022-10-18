import type {Types} from "mongoose";
import {Schema, model} from "mongoose";
import type {User} from "../user/model";

export type CommunityScore = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  score: number;
};

export type PopulatedCommunityScore = {
  _id: Types.ObjectId;
  userId: User;
  score: number;
};

const CommunityScoreSchema = new Schema<CommunityScore>({
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
});

export default model<CommunityScore>("CommunityScore", CommunityScoreSchema);
