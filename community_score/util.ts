import {HydratedDocument, Types} from "mongoose";
import {CommunityScore} from "./model";

type ScoreResponse = {
  userId: Types.ObjectId | string;
  score: number;
};

/**
 * Get community score response
 */
export const constructScoreResponse = (score: HydratedDocument<CommunityScore>
): ScoreResponse => {
  const {_id: userId} = score.userId;
  return {userId, score: score.score};
};

/**
 * Calculate community score for a piece of content
 * 
 * This method was very very heavily inspired by:
 * https://blog.logrocket.com/sentiment-analysis-node-js/
 *
 * @param content
 * @returns score
 */
export const getContentCommunityScore = (content: string): number => {
  
  const aposToLexForm = require('apos-to-lex-form');
  const natural = require('natural');
  
  const lexedReview = aposToLexForm(content);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
  
  const {WordTokenizer} = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  const SW = require('stopword');
  const filteredReview = SW.removeStopwords(tokenizedReview);

  const {SentimentAnalyzer, PorterStemmer} = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const analysis = analyzer.getSentiment(filteredReview)

  return analysis;
};

