// pathToData can't be used together with a post-request script (it's ignored when one is
// set), so row extraction happens here instead. On the benign "past the last page" error
// that errorHandling/endpoints.js suppresses, the raw body has no "result" at all — return
// an empty array so this page contributes zero rows and paging's rowCountIn sees 0, which
// is what stops pagination cleanly (see errorHandling/endpoints.js for why that's needed).
const items = (data && data.result && data.result.items) || [];
const companyName = context.objects[0]?.name;
// getManagedEndpointDetails (endpointDetails.json) only returns data for managed
// endpoints, and it's queried per GravityZone Endpoint object created from this row set.
// Dropping unmanaged endpoints here keeps those objects from being created at all,
// instead of creating them and having every endpointDetails call fail.
result = items.filter((item) => item.isManaged).map((item) => ({ ...item, companyName }));
