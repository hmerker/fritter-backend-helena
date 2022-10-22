import type {HydratedDocument} from "mongoose";
import type {SharedFreet, PopulatedSharedFreet} from "./model";
import moment from 'moment';
import type {User} from "../user/model";

// Update this if you add a property to the Freet type!
type SharedFreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  comments: number;
  likes: number;
  reports: number;
  collaboratingAuthors: Array<User>;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
 const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');


/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<SharedFreet>} freet - A freet
 * @returns {SharedFreetResponse} - The freet object formatted for the frontend
 */
const constructSharedFreetResponse = (freet: HydratedDocument<SharedFreet>): SharedFreetResponse => {
  const freetCopy: PopulatedSharedFreet = {
    ...freet.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
  };
};

export {constructSharedFreetResponse};

