import { sessionApi } from "@/api/SessionApi";
import { ColorModeSwitcher } from "@/components/ColorModeSwitcher";
import { SessionLayout } from "@/layout/SessionLayout";
import { SessionBookPagePropsContext } from "@/pages/SessionBookPage.param";
import { Session } from "@/types/Session";
import { CalendarIcon, ClockIcon, CurrencyDollarIcon } from "@heroicons/react/solid";
import { utils } from "ethers";
import { useQuery } from "react-query";
import { TimezoneSwitcher } from "../../components/TimezoneSwitcher";
import { useTimezoneSettings } from "../../hooks/useTimezoneSettings";
import { SessionBookFlow } from "./components/SessionBookFlow";
import { Spinner } from '@chakra-ui/react'

export function SessionBook() {
  const timezoneSettings = useTimezoneSettings()
  const { params } = SessionBookPagePropsContext.usePageContext()

  const {
    data: session,
    isLoading: isLoadingSession,
    error: errorSession,
  } = useQuery<Session, Error>(`:Session:${params.sessionId}`, async () => {
    return await sessionApi.getSession(params.sessionId)
  })

  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="mb-2 flex flex-row justify-end gap-4">
            <ColorModeSwitcher />
          </div>
          <div className="SessionBook transition-all duration-500 ease-in-out">
            {!session && (
              <div className="flex flex-row justify-center items-center min-h-[360px] min-w-[600px] p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border">
                {isLoadingSession && (
                  <Spinner />
                )}
                {errorSession && (
                  <div>
                    <div>Error!</div>
                    <div className="max-w-[450px]">{errorSession.message}</div>
                  </div>
                )}
              </div>
            )}
            {session && (
              <div className="flex flex-row p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border min-h-[356px]">
                <div className="max-w-96 min-w-[240px]">
                  <div className="pr-8 border-r dark:border-gray-800 flex flex-col items-start text-left h-full">
                    <h2 className="font-medium text-gray-500 dark:text-gray-300">
                      {session.user.handle}
                    </h2>
                    <h1 className="font-cal mb-4 text-3xl font-semibold">
                      {session.title || "Loading..."}
                    </h1>
                    <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
                      <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                      {(session.duration || 0) / 60} minutes
                    </p>
                    {/* <p className="-ml-2 px-2 py-1 text-gray-500 text-green-500">
                      <CalendarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                      {new Date(params.time).toLocaleString("en-US", { timeZone: timezoneSettings.settings.timezone })}
                    </p>
                    <p className="mb-1 -ml-2 px-2 text-gray-500 text-green-500">
                      <CalendarIcon className="mr-1 -mt-1 inline-block h-4 w-4 opacity-0" />
                      {timezoneSettings.settings.timezone}
                    </p> */}
                    <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
                      <CurrencyDollarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                      { session.token.amount ? utils.formatEther(session.token.amount) : "" } {session.token.symbol || "..."}
                    </p>
                    {session.description && (
                      <p className="mt-3 mb-8 text-gray-600 dark:text-gray-200">
                        {session.description}
                      </p>
                    )}
                    <TimezoneSwitcher />
                  </div>
                </div>
                <div className="pl-8 min-w-[360px]">

                  <SessionBookFlow session={session}/>

                </div>
              </div>
            )}
          </div>
          <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
        </div>
      </div>
    </SessionLayout>
  );
}
