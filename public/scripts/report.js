/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewAllReportsByContentId(fields) {
  fetch(`/api/reports?parentContentId=${fields.parentContentId}`)
    .then(showResponse)
    .catch(showResponse);
}

function createReport(fields) {
  fetch("/api/reports", {method: "POST", body: JSON.stringify(fields), headers: {"Content-Type": "application/json"}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteReport(fields) {
  fetch(`/api/reports/${fields.id}`, {method: "DELETE"})
    .then(showResponse)
    .catch(showResponse);
}
  