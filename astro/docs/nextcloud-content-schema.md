# Nextcloud CMS content schema (minimum viable)

The Astro site expects this folder structure inside the Nextcloud **service account** files area:

```
Artists/
  {artistSlug}/
    info.json
    bio.md            (optional)
    portfolio/        (optional)
      image-1.jpg
      image-2.avif
```

## `Artists/{artistSlug}/info.json`

Minimum fields supported today:

```json
{
  "name": "Artist Name",
  "specialties": ["Traditional", "Blackwork"],
  "calendarUrl": "https://portal.united-tattoos.com/remote.php/dav/calendars/service-account/artist-calendar/"
}
```

Notes:
- `calendarUrl` is required for **availability checks** and **booking requests**.
- `calendar_url` is also accepted.


