/* eslint-disable @typescript-eslint/restrict-template-expressions */

function getCredibilityCount(fields) {
  fetch("/api/credibilityCounts").then(showResponse).catch(showResponse);
}
  