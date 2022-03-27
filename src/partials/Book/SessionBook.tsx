import { SessionBookPagePropsContext } from "@/pages/SessionBookPage.param";
import { Session, SessionSlot } from "@/types/Session";
import { Box, Button, Center, Container } from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { ClockIcon, CurrencyDollarIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { add } from "date-fns";
import { ethers, utils } from "ethers";
import { useQuery } from "react-query";
import { ColorModeSwitcher } from "../../components/ColorModeSwitcher";
import { useAppColorMode } from "../../hooks/useColorMode";
import { SessionLayout } from "../../layout/SessionLayout";
import { SessionBookFlow } from "./components/SessionBookFlow";
import sessionsABI from "../../web3/abis/sessions.json";
import lensHubABI from "../../web3/abis/lensHub.json";
import erc20ABI from "../../web3/abis/erc20.json";
import { useEffect, useMemo, useState } from "react";

export function SessionBook() {
  const { toggleColorMode } = useAppColorMode()
  const { params } = SessionBookPagePropsContext.usePageContext()
  
  const provider = useMemo(() => {
    return new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
  }, [])
         

  const sessionsContract = useMemo(() => {
    return new ethers.Contract(
      "0x6dc0424c5beb6bfadd150633e2e99522ddc0802d",
      sessionsABI,
      provider
    );
  }, [provider])

  const lensHubContract = useMemo(() => {
    return new ethers.Contract(
      "0xd7B3481De00995046C7850bCe9a5196B7605c367",
      lensHubABI,
      provider
    );
  }, [provider])

  const [session, setSession] = useState<Session | null>(null)

  const loadSession = useMemo(() => {
    return async () => {
      const sessionType = await sessionsContract.getSessionType(params.profileId, params.sessionId)
      console.log("sessionType", sessionType)

      const profile = await lensHubContract.getProfile(params.profileId)

      setSession({
        id: sessionType.id,
        user: {
          handle: profile.handle,
          address: sessionType.recipient,
        },
        title: sessionType.title,
        duration: 60 * sessionType.durationInSlot,
        availableDates: [
          new Date().toISOString(),
          add(new Date(), { days: 1}).toISOString(),
        ],
        token: {
          symbol: "MATIC",
          amount: sessionType.amount,
          decimals: 18
        }
      })
    }
  }, [sessionsContract, params.profileId, params.sessionId, lensHubContract])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const {
    data: slots,
    isLoading: isLoadingSlots,
  } = useQuery<SessionSlot[]>(`SessionSlots:${params.sessionId}:${params.date}`, async () => {
    return [
      { time: "09:00", booked: false },
      { time: "09:30", booked: false },
      { time: "10:00", booked: false },
    ]
  }, {
    enabled: !!params.date,
  })

  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="mb-2 flex flex-row justify-end gap-4">
            <ColorModeSwitcher />
          </div>
          <div className="SessionBook transition-all duration-500 ease-in-out">
            <div className="flex flex-row p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border min-h-[356px]">
              <div className="max-w-96 min-w-[240px]">
                <div className="pr-8 border-r dark:border-gray-800 flex flex-col items-start text-left h-full">
                  <h2 className="font-medium text-gray-500 dark:text-gray-300">
                    {session?.user.handle || "..."}
                  </h2>
                  <h1 className="font-cal mb-4 text-3xl font-semibold">
                    {session?.title || "Loading..."}
                  </h1>
                  <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
                    <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                    {(session?.duration || 0) / 60} minutes
                  </p>
                  <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
                    <CurrencyDollarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                    { session?.token.amount ? utils.formatEther(session?.token.amount) : "" } {session?.token.symbol || "..."}
                  </p>
                  {session?.description && (
                    <p className="mt-3 mb-8 text-gray-600 dark:text-gray-200">
                      {session?.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="pl-8 min-w-[360px]">

                <SessionBookFlow session={session}/>

              </div>
            </div>
          </div>
          <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
        </div>
      </div>
    </SessionLayout>
  );
}
