import React, { FunctionComponent } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { recoilPersist } from "recoil-persist";
import { ProfileWithWallet } from "../types";

const { persistAtom } = recoilPersist();

export interface ProfileSettings {
  profile: ProfileWithWallet | undefined;
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

export const useLogout = () => {
  const setState = useSetRecoilState(ProfileSettingsStore);
  return () => setState({ profile: undefined });
};

export const ProfileProvider: FunctionComponent = (props) => {
  const settings = useProfileValue();
  return (
    <ProfileContext.Provider value={settings}>
      {props.children}
    </ProfileContext.Provider>
  );
};
