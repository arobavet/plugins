// pathToData can't be used together with a post-request script, so the "result"
// extraction happens here instead of via pathToData.
const item = (data && data.result) || {};
result = [{ ...item, companyName: context.objects[0]?.name }];
