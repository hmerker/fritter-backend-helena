/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllSharedFreets(fields) {
  fetch('/api/sharedFreets')
    .then(showResponse)
    .catch(showResponse);
}

function viewSharedFreetsByAuthor(fields) {
  fetch(`/api/sharedFreets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createSharedFreet(fields) {
  fetch('/api/sharedFreets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editSharedFreet(fields) {
  fetch(`/api/sharedFreets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteSharedFreet(fields) {
  fetch(`/api/sharedFreets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

