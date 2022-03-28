import React, { useMemo } from "react"
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from 'recoil-persist';
import timezones from "timezones-list";
import { getTimezoneOffset } from 'date-fns-tz';

const { persistAtom } = recoilPersist();

export interface TimezoneSettings {
  timezone: string;
  clock24hour: boolean;
}

export const DEFAULT_TIMEZONE_SETTINGS = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  clock24hour: true,
}

export const TimezoneSettingsStore = atom<TimezoneSettings>({
  key: "TimezoneSettings",
  default: DEFAULT_TIMEZONE_SETTINGS,
  effects: [persistAtom],
})

export const TimezoneContext = React.createContext<TimezoneSettings>({
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  clock24hour: true,
})

export function useTimezoneSettings() {
  const [settings, setSettings] = useRecoilState(TimezoneSettingsStore)

  const current = useMemo(() => {
    const timezone = timezones.find((tz) => tz.tzCode === settings.timezone)
    const offset = getTimezoneOffset(settings.timezone)
    return {
      timezone, offset
    }
  }, [settings.timezone])

  return {
    settings, setSettings,
    timezones,
    current,
  }
}