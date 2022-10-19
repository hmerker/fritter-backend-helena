/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewAllLikesByContentId(fields) {
  fetch(`/api/likes?parentContentId=${fields.parentContentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createLike(fields) {
  fetch("/api/likes", {method: "POST", body: JSON.stringify(fields), headers: {"Content-Type": "application/json"}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteLike(fields) {
  fetch(`/api/likes/${fields.id}`, {method: "DELETE"})
    .then(showResponse)
    .catch(showResponse);
}