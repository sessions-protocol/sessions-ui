import { atom, useRecoilState, useRecoilValue } from 'recoil';


export interface Web3ClientState {
  isEagerConnectTried: boolean;
}

export const DEFAULT_WEB_3_CLIENT_STATE: Web3ClientState = {
  isEagerConnectTried: false,
};

export const Web3ClientStateStore = atom<Web3ClientState>({
  key: "Web3ClientState",
  default: DEFAULT_WEB_3_CLIENT_STATE,
});

export const useWeb3ClientState = () => useRecoilState(Web3ClientStateStore);

export const useWeb3ClientStateValue = () => useRecoilValue(Web3ClientStateStore);

