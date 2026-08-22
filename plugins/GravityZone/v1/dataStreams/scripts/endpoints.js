// pathToData can't be used together with a post-request script (it's ignored when one is
// set), so row extraction happens here instead. On the benign "past the last page" error
// that errorHandling/endpoints.js suppresses, the raw body has no "result" at all — return
// an empty array so this page contributes zero rows and paging's rowCountIn sees 0, which
// is what stops pagination cleanly (see errorHandling/endpoints.js for why that's needed).
const items = (data && data.result && data.result.items) || [];
const companyName = context.objects[0]?.name;
result = items.map((item) => ({ ...item, companyName }));
