import type {Types} from "mongoose";
import {Schema, model} from "mongoose";
import type {User} from "../user/model";

export type Follower = {
  _id: Types.ObjectId;
  follower: Types.ObjectId;
  userFollowed: Types.ObjectId;
};

export type PopulatedFollower = {
  _id: Types.ObjectId;
  follower: User;
  userFollowed: User;
};

const FollowerSchema = new Schema<Follower>({
  follower: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userFollowed: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

export default model<Follower>("Follower", FollowerSchema);
