
function viewLikeByItem(fields) {
  fetch(`/api/likes?itemId=${fields.itemId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createLike(fields) {
  fetch('/api/likes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteLike(fields) {
  fetch(`/api/likes/${fields.itemId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}
