import React, { useMemo } from "react"
import { atom, useRecoilState } from "recoil";
import { recoilPersist } from 'recoil-persist';
import timezones from "timezones-list";

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

  const currentTimezone = useMemo(() => {
    return timezones.find((tz) => tz.tzCode === settings.timezone)
  }, [settings])

  return {
    settings, setSettings,
    currentTimezone,
    timezones,
  }
}