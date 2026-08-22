Monitor your [Bitdefender GravityZone](https://www.bitdefender.com/business/) managed estate in SquaredUp — companies, endpoints, security policies, and quarantined items — via the [GravityZone Public API](https://www.bitdefender.com/business/support/en/77209-125277-public-api.html).

> ⚠️ Requires a **Partner/MSP**-tier GravityZone account. A single-company **Customer** account can authenticate but will only see its own company, since company listing is a partner-only capability.

## Setup

You will need a GravityZone **Access URL** and an **API Key**.

1. Sign in to [GravityZone Control Center](https://gravityzone.bitdefender.com/) using an account with **Manage Networks**, **Manage Users**, **Manage Company**, and **Manage Reports** rights.
2. Click your username in the upper-right corner and choose **My Account**.
3. Go to the **Control Center API** section and copy the **Access URL** into the **Access URL** field.
4. Go to the **API keys** section, click **Add**, and select the **Companies**, **Licensing**, **Network**, **Policies**, and **Quarantine** APIs.
5. Click **Save**, copy the generated key — it is shown only once — and paste it into the **API Key** field.

## Configuration fields

| Field | What it is | Where to find it | Required |
| ----- | ---------- | ----------------- | -------- |
| **Access URL** | The base URL used to build every API request. | GravityZone → **My Account → Control Center API**. | Yes |
| **API Key** | Authenticates every request via HTTP Basic Auth (sent as the username, with an empty password). | GravityZone → **My Account → API keys** — see Setup above. | Yes |

On save, the plugin calls `getCompanyDetails` as a minimal authenticated probe; an invalid, unauthorized, or revoked key fails setup with an authentication error.

## What this plugin monitors

- **Companies** — the managed customer companies under your partner account.
- **Licensing** — subscription type, seat usage, expiry, and enabled feature flags per company.
- **Monthly usage** — endpoint, Exchange, and add-on seat consumption for the current month per company.
- **Endpoints** — managed devices belonging to a company, with OS, IP, and management status.
- **Policies** — security policies across every managed company.
- **Quarantine** — files quarantined on managed endpoints (Computers and Virtual Machines service) across the estate.

The out-of-the-box dashboards include an estate-wide **Overview**, a **Company** perspective, and an **Endpoint** perspective (select one or more endpoints to see their details side by side).

## Data streams

- **Company Endpoints** — managed endpoints for a company, one row per endpoint; each row drills down to that device's own **GravityZone Endpoint** object.
- **Endpoint Details** — agent, policy, malware status, and module status for one or more selected endpoints.
- **Company License** — subscription, seat usage, and enabled features for a company.
- **Company Monthly Usage** — current-month seat usage for a company.
- **Policies** — security policies across all managed companies.
- **Quarantine Items** — quarantined files across all managed endpoints.

## What gets indexed

| Object type | API source | Represents |
| ----------- | ---------- | ---------- |
| **GravityZone Company** | `getCompaniesList` (Network API) | A managed customer company. |
| **GravityZone Endpoint** | `getEndpointsList` (Network API), one call per company | A managed device. |

Endpoint import runs as 8 parallel shards, each covering a slice of companies (bucketed by the last hex digit of the company id) so that no single import step has to fan out to every company at once.

**Relationships:** each Endpoint belongs to a Company.

## Known limitations

- **Partner/MSP tier required** — company listing (`getCompaniesList`) is a partner-only capability; a single-company account will authenticate but see nothing.
- **Endpoint import scales to roughly 800 companies** — importing endpoints requires one API call per company (GravityZone has no cross-company endpoint listing); a single import step fanning out to every company at once runs out of memory on large partner accounts. Endpoints are imported as 8 parallel shards (companies bucketed by the last hex digit of their id) to keep each step's fan-out bounded — tested clean up to 434 companies. Beyond roughly 800 companies, some shards may still run out of memory and the affected companies' endpoints won't land as **GravityZone Endpoint** objects that import cycle; endpoints remain fully available as a table on the Company perspective regardless (just not selectable by name in the **Endpoint Details** picker until a later import cycle catches them).
- **Rate limit** — GravityZone enforces 10 requests/second per API key; very large partner accounts (hundreds of companies with many endpoints each) may see slower dashboard loads on endpoint-heavy tiles.
- **Quarantine covers Computers and Virtual Machines only** — Exchange mailbox quarantine isn't included.
- **No incident/threat timeline** — GravityZone's public API doesn't expose one; this plugin covers licensing, policies, endpoints, and quarantine only.
- **Read-only** — the plugin never creates, modifies, or deletes anything in GravityZone.
