/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable arrow-body-style */
import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import LikeCollection from '../like/collection';
/**
 * Check if user has already liked the item.
 */
export const alreadyLiked = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {itemId} = req.body;
    const doesExist = await LikeCollection.findOneByUserId(req.session.userId, itemId);
    if (doesExist) {
      return res.status(404).json({message: 'This user has already liked this item.'});
    }
    
    next();
  };
};

/**
 * Check if itemId is given.
 */
export const isItemIdGiven = (reqInfoType: 'query' | 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    if (!information.itemId) {
      return res.status(400).json({message: 'itemId not given'});
    }
    
    next();
  };
};

/**
 * Determine whether the itemId exists.
 */
export const doesItemIdExist = (reqInfoType: 'body' | 'query') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = req[reqInfoType].itemId as string;
    const freet = FreetCollection.findById(id);
    if (!freet) {
      return res.status(404).json({message: 'itemId does not exist'});
    }

    next();
  };
};
