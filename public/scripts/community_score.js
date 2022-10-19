/* eslint-disable @typescript-eslint/restrict-template-expressions */

function getCommunityScore(fields) {
  fetch("/api/communityScores").then(showResponse).catch(showResponse);
}
  