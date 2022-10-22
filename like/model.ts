import type {Types} from "mongoose";
import {Schema, model} from "mongoose";
import type {User} from "../user/model";

export type Like = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  parentContentId: Types.ObjectId;
  parentContentType: "freet" | "comment" | "shared_freet";
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  userId: User;
  parentContentId: Types.ObjectId;
  parentContentType: "freet" | "comment" | "shared_freet";
};

const LikeSchema = new Schema<Like>({
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  parentContentId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  parentContentType: {
    type: String,
    required: true,
  },
});

export default model<Like>("Like", LikeSchema);
