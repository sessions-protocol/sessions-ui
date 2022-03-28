import React from "react"
import { atom, useRecoilValue } from "recoil";
import { recoilPersist } from 'recoil-persist';

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

export interface TimezoneProviderProps {
  children: React.ReactNode;
}
export function TimezoneProvider(props: TimezoneProviderProps) {
  const settings = useRecoilValue(TimezoneSettingsStore)
  return (
    <TimezoneContext.Provider value={settings}>
      {props.children}
    </TimezoneContext.Provider>
  )
}

