import React, { useEffect, useMemo, useState } from "react";

type Props = {
  artistSlugs: string[];
};

type AvailabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available" }
  | { status: "unavailable"; reason?: string }
  | { status: "error"; message: string };

const TIME_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
] as const;

function parseLocalDateTime(date: string, time: string): Date | null {
  // date: YYYY-MM-DD (from <input type="date">)
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, y, mo, d] = m;

  const tm = time.match(/^(\d{2}):(\d{2})$/);
  if (!tm) return null;
  const [, hh, mm] = tm;

  const year = Number(y);
  const monthIndex = Number(mo) - 1;
  const day = Number(d);
  const hour = Number(hh);
  const minute = Number(mm);

  if (
    !Number.isFinite(year) ||
    !Number.isFinite(monthIndex) ||
    !Number.isFinite(day) ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute)
  ) {
    return null;
  }

  const local = new Date(year, monthIndex, day, hour, minute, 0, 0);
  return Number.isNaN(local.getTime()) ? null : local;
}

export function BookingIsland({ artistSlugs }: Props) {
  const [artistSlug, setArtistSlug] = useState<string>(artistSlugs[0] ?? "");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "idle" });

  const startEnd = useMemo(() => {
    if (!date || !time) return null;
    // Default: 2h requested slot (will become size-based later).
    // IMPORTANT: construct as local time (Date(string) may parse as UTC and shift timezones).
    const start = parseLocalDateTime(date, time);
    if (!start) return null;
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    return { startTime: start.toISOString(), endTime: end.toISOString() };
  }, [date, time]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!artistSlug || !startEnd) {
        setAvailability({ status: "idle" });
        return;
      }

      setAvailability({ status: "checking" });
      try {
        const params = new URLSearchParams({
          artistSlug,
          startTime: startEnd.startTime,
          endTime: startEnd.endTime,
        });
        const res = await fetch(`/api/availability?${params.toString()}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.error || `Availability check failed (${res.status})`);
        }
        if (cancelled) return;
        if (data.available) setAvailability({ status: "available" });
        else setAvailability({ status: "unavailable", reason: data.reason });
      } catch (e) {
        if (cancelled) return;
        setAvailability({
          status: "error",
          message: e instanceof Error ? e.message : "Availability check failed",
        });
      }
    };

    const t = setTimeout(run, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [artistSlug, startEnd]);

  const canSubmit = availability.status === "available";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistSlug || !startEnd) return;

    const res = await fetch("/api/booking-request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        artistSlug,
        startTime: startEnd.startTime,
        endTime: startEnd.endTime,
        notes,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "Booking request failed.");
      return;
    }
    alert("Request submitted! The studio will confirm your appointment.");
    setNotes("");
  };

  return (
    <form onSubmit={submit}>
      <fieldset>
        <legend>Booking</legend>

        <div>
          <label>Artist</label>
          <select
            value={artistSlug}
            onChange={(e) => setArtistSlug(e.target.value)}
          >
            {artistSlugs.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>

        <div>
          <label>Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a time
            </option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <p>Initial migration uses a default 2-hour slot.</p>
        </div>

        <div>
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe your idea, placement, and any constraints…"
          />
        </div>
      </fieldset>

      <div>
        {availability.status === "idle" && <p>Select an artist, date, and time to check availability.</p>}
        {availability.status === "checking" && <p>Checking availability…</p>}
        {availability.status === "available" && <p>Time slot available.</p>}
        {availability.status === "unavailable" && (
          <p>
            Time slot not available{availability.reason ? `: ${availability.reason}` : "."}
          </p>
        )}
        {availability.status === "error" && <p>Error: {availability.message}</p>}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
      >
        Submit Booking Request
      </button>
    </form>
  );
}


