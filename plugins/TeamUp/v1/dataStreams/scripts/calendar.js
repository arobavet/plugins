const cfg = data.configuration || {};

result = [
    {
        id: cfg.link && cfg.link.app_id,
        name: (cfg.identity && cfg.identity.title) || "Teamup Calendar",
        timezone: cfg.date_time && cfg.date_time.tz,
        subcalendarCount: (cfg.subcalendars || []).length,
    },
];
