// GravityZone's getEndpointsList has no "empty page" response for a page beyond the
// last one — it returns a JSON-RPC error ("Invalid value for 'page' parameter") instead
// of an empty items array. Pagination here only stops once a page yields zero rows, so
// without this, every company's fetch ends in a hard failure on its final "one past the
// end" page, discarding rows already collected from earlier pages. Treat that specific,
// expected error as "no more results" (paired with postRequestScript, which turns the
// same suppressed response into an empty row array). Any other error (auth, invalid
// parentId, rate limit, etc.) still surfaces normally.
const details = data && data.error && data.error.data && data.error.data.details;
const isPastLastPage = typeof details === "string" && details.indexOf("Invalid value for 'page' parameter") !== -1;

if (!isPastLastPage) {
    result = data && data.error && data.error.message;
}
