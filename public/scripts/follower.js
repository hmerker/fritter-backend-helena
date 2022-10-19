/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewTotalFollowerCounts(fields) {
  fetch(`/api/followers?userId=${fields.userId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFollower(fields) {
  fetch("/api/followers", {method: "POST", body: JSON.stringify(fields), headers: {"Content-Type": "application/json"}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollower(fields) {
  fetch(`/api/followers/${fields.id}`, {method: "DELETE"})
    .then(showResponse)
    .catch(showResponse);
}