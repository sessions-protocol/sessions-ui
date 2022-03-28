import { sessionApi } from "@/api/SessionApi";
import { SessionScheduledPagePropsContext } from "@/pages/SessionScheduledPage.param";
import { Session } from "@/types/Session";
import { Button } from "@chakra-ui/react";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useQuery } from "react-query";
import { SessionLayout } from "../../layout/SessionLayout";
import { formatInTimeZone } from 'date-fns-tz';
import { useTimezoneSettings } from "../../hooks/useTimezoneSettings";
import { add } from "date-fns";

export function SessionScheduled() {
  const timezoneSettings = useTimezoneSettings()
  const { params } = SessionScheduledPagePropsContext.usePageContext()
  const [ addToCalendar, setAddToCalendar ] = useState(false)
  const {
    data: session,
    isLoading: isLoadingSession,
    error: errorSession,
  } = useQuery<Session, Error>(`Session:${params.sessionId}`, async () => {
    return await sessionApi.getSession(params.sessionId)
  })


  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="SessionScheduled transition-all duration-500 ease-in-out">
            <div className="flex flex-col text-center p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border min-h-[356px]">
              <div className="flex flex-col text-center text-green-500 my-4">
                <BadgeCheckIcon className="mx-auto -mt-1 inline-block h-12 w-12" />
              </div>
              <div className="flex flex-col text-center h-full px-4">
                <h2 className="font-bold text-2xl text-gray-700 dark:text-gray-200">
                  This session is scheduled
                </h2>

                <div className="my-4 grid grid-cols-3 border-t border-b py-4 text-left text-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                  <div className="font-medium">What</div>
                  <div className="col-span-2 mb-6">{session?.title} with @{session?.user.handle}</div>
                  <div className="font-medium">When</div>
                  <div className="col-span-2">
                    {formatInTimeZone(new Date(params.time), timezoneSettings.settings.timezone, "EEEE, MMMM d, yyyy")}
                    <br/>
                    {formatInTimeZone(
                      new Date(params.time),
                      timezoneSettings.settings.timezone, 
                      timezoneSettings.settings.clock24hour ? "HH:mm": "hh:mm aaa"
                    )}
                    {" to "}
                    {formatInTimeZone(
                      add(new Date(params.time), { seconds: session?.duration }),
                      timezoneSettings.settings.timezone, 
                      timezoneSettings.settings.clock24hour ? "HH:mm": "hh:mm aaa"
                    )}
                    <span className="text-gray-500">{` (${timezoneSettings.settings.timezone})`}</span>
                  </div>
                </div>
                <div className="relative">
                  <Button isFullWidth colorScheme={"green"} onClick={() => {
                    setAddToCalendar(!addToCalendar)
                  }}>Add to calendar</Button>

                  <div className={`${addToCalendar ? "" : "hidden"} bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow  absolute w-full`}>
                    <ul className="py-1">
                      <li>
                        <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${params.time}&details=${session?.description}&location=New%20Earth&text=${session?.title}`} target="_blank"  className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2" rel="noreferrer">Google</a>
                      </li>
                      <li>
                        <a  href={`https://outlook.office.com/calendar/0/deeplink/compose?body=${session?.description}&location=New%20Earth&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${params.time}&enddt=${params.time}&subject=${session?.title}`} target="_blank" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2" rel="noreferrer">Outlook.com</a>
                      </li>
                      <li>
                        <a href={`https://outlook.office.com/calendar/0/deeplink/compose?body=${session?.description}&enddt=${params.time}&location=New%20Earth&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${params.time}&subject=${session?.title}`} target="_blank" className="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2" rel="noreferrer">Office 365</a>
                      </li>

                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
        </div>
      </div>
    </SessionLayout>
  );
}
