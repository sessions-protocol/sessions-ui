import { Profile } from '@/lens/profile';
import React, { FunctionComponent } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface ProfileSettings {
  profile: Profile | undefined;
}

export const DEFAULT_PROFILE_SETTINGS = {
  profile: undefined,
};

export const ProfileSettingsStore = atom<ProfileSettings>({
  key: "ProfileSettings",
  default: DEFAULT_PROFILE_SETTINGS,
  effects: [persistAtom],
});

export const useProfileState = () => useRecoilState(ProfileSettingsStore);

export const useProfileValue = () => useRecoilValue(ProfileSettingsStore);

export const ProfileContext = React.createContext<ProfileSettings>({
  profile: undefined,
});

export const ProfileProvider: FunctionComponent = (props) => {
  const settings = useProfileValue();
  return (
    <ProfileContext.Provider value={settings}>
      {props.children}
    </ProfileContext.Provider>
  )
};

