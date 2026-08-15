Monitor a [Teamup](https://www.teamup.com) calendar's sub-calendars and events in SquaredUp via the [Teamup Calendar API](https://apidocs.teamup.com).

> ⚠️ This plugin is scoped to a **single calendar** per configuration — add it again for each additional calendar you want to monitor. It is read-only and never creates, modifies, or deletes anything in Teamup.

## Setup

You will need a Teamup **API key** and a **Calendar Key** for the calendar you want to monitor.

1. Request an API key by filling in the form at [teamup.com/api-keys/request](https://teamup.com/api-keys/request). Approval is manual, so allow some time before it arrives by email.
2. Open the calendar you want to monitor in Teamup and go to **Settings → Sharing**.
3. Create (or copy an existing) access key. **Read-only** permission is enough for monitoring; **Administrator** permission additionally reveals each sub-calendar's type and any inactive sub-calendars.
4. Paste the API key into the **API Key** field and the calendar's access key into the **Calendar Key** field.

## Configuration fields

| Field | What it is | Where to find it | Required |
| ----- | ---------- | ---------------- | -------- |
| **API Key** | Authenticates every request via the `Teamup-Token` header. | Requested at [teamup.com/api-keys/request](https://teamup.com/api-keys/request). | Yes |
| **Calendar Key** | Identifies and authorizes access to a specific calendar. | The calendar's **Settings → Sharing** page in Teamup. | Yes |

On save, the plugin validates the credentials by fetching the calendar's configuration; a failure shows a specific error explaining what to check.

## What this plugin monitors

- **Calendar structure** — the configured calendar and its sub-calendars (resources/schedules), including each sub-calendar's active status, color, and overlap settings.
- **Events** — event listings across the whole calendar or scoped to a single sub-calendar, over a selectable date range, including title, time, location, and attendee ("who") info.

The out-of-the-box dashboards include an **Overview** for the whole calendar plus a **Sub-Calendar** perspective for each sub-calendar.

## Data streams

- **Events** — events in the configured calendar for a selected date range, one row per event, optionally scoped to a single sub-calendar.

## What gets indexed

| Object type | API source | Represents |
| ----------- | ---------- | ---------- |
| **Calendar** | `GET /configuration` | The one Teamup calendar this datasource is configured against. |
| **Sub-Calendar** | `GET /configuration` (embedded `subcalendars`) | A resource or schedule within the calendar. |

**Relationships:** each Sub-Calendar belongs to the Calendar.

## Known limitations

- **Single calendar per configuration** — add the plugin again, with a different Calendar Key, to monitor another calendar.
- **Permission-dependent fields** — a **read-only** Calendar Key is enough for monitoring, but Teamup only returns a sub-calendar's `type` (standard vs. read-only iCalendar feed) and any **inactive** sub-calendars when the key has **Administrator** permission.
- **Events timeframe is capped at a quarter** — the Events stream can return a large number of rows on a busy calendar (roughly 500KB+ per 30 days in testing), so `thisYear`/`lastYear` are not offered; the widest available range is `thisQuarter`/`lastQuarter`.
- **Event times reflect the calendar's local timezone** — Teamup returns event start/end times without a UTC offset; they are shown using the calendar's configured timezone (visible on the Calendar's properties), not necessarily the viewer's.
- **Read-only** — the plugin never creates, modifies, or deletes anything in Teamup.
