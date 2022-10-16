import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Like = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  userId: User;
  itemId: Types.ObjectId;
};

const LikeSchema = new Schema<Like>({
  userId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;

