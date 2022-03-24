import { SessionBookPagePropsContext } from "@/pages/SessionBookPage.param";
import { ConnectorList } from "@/web3/components/ConnectorList";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import { TextAbbrLabel } from "../../../components/TextAbbrLabel";

type SessionBookFlowStep = 'connectWallet' | 'loginLensProfile' | 'submit' | 'done';

export function SessionBookFlow() {
  const { chainId, account, deactivate } = useWeb3React()
  const { params } = SessionBookPagePropsContext.usePageContext()

  const [profile, setProfile] = useState<{} | null>(null)

  return (
    <div>
      <div className="text-left">
        {chainId && account && (
          <div className="flex flex-row justify-between items-center border-b border-gray-600 mb-2">
            <div className="text-xs text-gray-300">Wallet Connected</div>
            <div className="flex flex-row items-center">
              <div className="text-sm"><TextAbbrLabel text={account} front={6} end={4} /></div>
            </div>
          </div>
        )}

        {profile && (
          <div className="flex flex-row justify-between items-center border-b border-gray-600 mb-2">
            <div className="text-xs text-gray-300">Lens logged in</div>
            <div className="flex flex-row items-center">
              <div className="text-sm">username</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6">
        {(!chainId || !account) && (
          <div>
            <div className="text-lg font-medium mb-4">Connect Wallet</div>
            <ConnectorList />
          </div>
        )}
        {chainId && account && !profile && (
          <div>
            <div className="text-lg font-medium mb-4">Create Lens Profile</div>
            <form className="text-left">
              <label htmlFor="username" className="text-left font-medium">Username</label>
              <input name="username" className="w-full bg-black text-white text-lg py-1 px-2"></input>
              <button
                className="bg-white rounded text-black px-2 py-1 text-base w-full hover:bg-gray-100 mt-4"
                onClick={() => {
                  setProfile({})
                }}
              >Create</button>
            </form>
          </div>
        )}
        {chainId && account && profile && (
          <div>
            <div className="text-lg font-medium mb-4">Confirm Session Slot</div>
            <button
                className="bg-white rounded text-black px-2 py-1 text-base w-full hover:bg-gray-100 mt-4"
                onClick={() => {
                }}
              >Book</button>
          </div>
        )}
      </div>
    </div>

  );
}
