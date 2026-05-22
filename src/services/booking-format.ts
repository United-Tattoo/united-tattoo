interface SelectedSlot {
  date: string;
  startTime: string;
}

const MAX_SELECTED_SLOTS = 3;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isSelectedSlot(value: unknown): value is SelectedSlot {
  // selected_slots comes from a hidden input and can be forged with a direct
  // POST. Validate the shape and simple date/time formats before rendering it
  // into emails.
  return (
    typeof value === 'object' &&
    value !== null &&
    'date' in value &&
    'startTime' in value &&
    typeof value.date === 'string' &&
    typeof value.startTime === 'string' &&
    DATE_PATTERN.test(value.date) &&
    TIME_PATTERN.test(value.startTime)
  );
}

export function formatSelectedSlots(selectedSlotsJson: string | null | undefined): string | undefined {
  if (!selectedSlotsJson) return undefined;

  try {
    const slots: unknown = JSON.parse(selectedSlotsJson);
    // The UI limits clients to 3 preferred times. Enforce the same contract on
    // the server so a forged payload cannot make the email noisy or misleading.
    if (
      !Array.isArray(slots) ||
      slots.length === 0 ||
      slots.length > MAX_SELECTED_SLOTS ||
      !slots.every(isSelectedSlot)
    ) {
      return undefined;
    }

    return slots.map((slot, i) => {
      // Build display text from validated YYYY-MM-DD and HH:mm strings. The
      // booking flow communicates these as Mountain Time, matching the calendar UI.
      const date = new Date(`${slot.date}T00:00:00`);
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const [h, m] = slot.startTime.split(':');
      const d = new Date();
      d.setHours(Number.parseInt(h, 10), Number.parseInt(m, 10));
      const timeStr = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });

      return `Choice #${i + 1}: ${dateStr} at ${timeStr} MT`;
    }).join('\n');
  } catch {
    return undefined;
  }
}
