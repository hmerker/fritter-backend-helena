/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewAllCommentsByContentId(fields) {
  fetch(`/api/comments?parentContentId=${fields.parentContentId}`)
    .then(showResponse)
    .catch(showResponse);
}
  
function createComment(fields) {
  fetch("/api/comments", {method: "POST", body: JSON.stringify(fields), headers: {"Content-Type": "application/json"}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteComment(fields) {
  fetch(`/api/comments/${fields.id}`, {method: "DELETE"})
    .then(showResponse)
    .catch(showResponse);
}