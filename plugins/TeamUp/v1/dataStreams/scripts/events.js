const events = data.events || [];

// Optional `subCalendar` object-picker parameter (stream `ui` name "subCalendar").
// Selected objects arrive at context.config.subCalendar as an ARRAY (multi-select),
// each rawId a single-element array. Empty/absent → account-wide, no filter.
const unwrap = (v) => (Array.isArray(v) ? v[0] : v);
const selected = (context.config && context.config.subCalendar) || [];
const subCalendarIds = new Set(
    selected.map((o) => Number(unwrap(o.rawId))).filter((n) => !isNaN(n)),
);

const scoped = subCalendarIds.size
    ? events.filter((e) =>
          (e.subcalendar_ids || []).some((id) => subCalendarIds.has(Number(id))),
      )
    : events;

result = scoped.map((e) => ({
    id: e.id,
    title: e.title,
    location: e.location,
    who: e.who,
    notes: e.notes,
    start_dt: e.start_dt,
    end_dt: e.end_dt,
    all_day: e.all_day,
    readonly: e.readonly,
    subcalendar_ids: e.subcalendar_ids,
    isRecurring: !!(e.rrule && e.rrule.length > 0),
}));
