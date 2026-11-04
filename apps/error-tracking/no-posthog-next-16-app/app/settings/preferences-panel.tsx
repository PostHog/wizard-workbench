'use client';

import { useEffect, useState } from 'react';
import { PreferencesParseError } from '@/lib/errors';

type Preferences = { currency: string; reminderDays: number };

// Settings exported by the previous version of the app: "currency|reminderDays".
const LEGACY_EXPORT = 'USD;14';

function parseLegacy(raw: string): Preferences {
  const [currency, days] = raw.split('|');
  if (!days) {
    throw new PreferencesParseError('Saved preferences are corrupt (PF88)');
  }
  return { currency, reminderDays: Number(days) };
}

export function PreferencesPanel() {
  const [legacy, setLegacy] = useState<string | null>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('import') === 'legacy') setLegacy(LEGACY_EXPORT);
  }, []);

  const prefs: Preferences = legacy ? parseLegacy(legacy) : { currency: 'USD', reminderDays: 7 };
  return (
    <ul>
      <li>Currency: {prefs.currency}</li>
      <li>Reminder after {prefs.reminderDays} days</li>
      <li>
        <a href="/settings?import=legacy">Import settings from the old app</a>
      </li>
    </ul>
  );
}
