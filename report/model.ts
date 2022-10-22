import type {Types} from "mongoose";
import {Schema, model} from "mongoose";
import type {User} from "../user/model";

export type Report = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  parentContentId: Types.ObjectId;
  parentContentType: "freet" | "comment" | "shared_freet";
  content: string;
};

export type PopulatedReport = {
  _id: Types.ObjectId;
  userId: User;
  parentContentId: Types.ObjectId;
  parentContentType: "freet" | "comment" | "shared_freet";
  content: string;
};

const ReportSchema = new Schema<Report>({
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
  content: {
    type: String,
    required: true,
  },
});

export default model<Report>("Report", ReportSchema);
