import { SessionDayPicker } from "./components/SessionDayPicker";
import { ClockIcon } from "@heroicons/react/solid";
import { SessionAvailablePagePropsContext } from "@/pages/SessionAvailablePage.param";
import { useQuery } from "react-query";
import { Session, SessionSlot } from "@/types/Session";
import { SessionSlotList } from "./components/SessionSlotList";
import { add } from "date-fns";
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ColorModeSwitcher } from "../../components/ColorModeSwitcher";
import { SessionLayout } from "../../layout/SessionLayout";
import { TimezoneSwitcher } from "../../components/TimezoneSwitcher";



export function SessionAvailable() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const { params } = SessionAvailablePagePropsContext.usePageContext()

  const {
    data: session,
    isLoading: isLoadingSession,
  } = useQuery<Session>(`Profile:${params.profileId}:Session:${params.sessionId}`, async () => {
    return {
      id: "1",
      user: {
        address: "0x28Ba69e289c15f8a751eb929D81ec35e891A80e2",
        handle: "jack",
      },
      title: "Tech Mentoring",
      duration: 60 * 30,
      availableDates: [
        new Date().toISOString(),
        add(new Date(), { days: 1}).toISOString(),
      ],
      token: {
        symbol: "TKN",
        amount: "1000000",
        decimals: 6,
      }
    }
  })
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

  const setSelectedDate = useCallback((date: Date) => {
    setSearchParams({
      ...searchParams,
      date: date.toISOString(),
    })
  }, [searchParams, setSearchParams])

  const gotoBookPage = useCallback((slot: string) => {
    if (!params.date) return;
    navigate(`/session/${params.profileId}/${params.sessionId}/book?date=${params.date}&slot=${slot}`)
  }, [navigate, params])

  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="mb-2 flex flex-row justify-end gap-4">
            <ColorModeSwitcher />
          </div>
          <div className="SessionAvailable transition-all mx-auto duration-500 ease-in-out">
            <div className="flex flex-row p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border">
              <div className="max-w-96">
                <div className="pr-8 border-r dark:border-gray-600 flex flex-col items-start text-left h-full">
                  <h2 className="mt-3 font-medium text-gray-500 dark:text-gray-300">
                    @{session?.user.handle}
                  </h2>
                  <h1 className="font-cal mb-4 text-3xl font-semibold">
                    {session?.title}
                  </h1>
                  <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
                    <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                    {(session?.duration || 0) / 60} minutes
                  </p>
                  {session?.description && (
                    <p className="mt-3 mb-8 text-gray-500">
                      {session?.description}
                    </p>
                  )}
                  <TimezoneSwitcher />
                </div>
              </div>
              <div className="px-8">
                <SessionDayPicker
                  availableDates={session?.availableDates || []}
                  selected={(params.date && new Date(params.date)) || null}
                  onSelect={(date) => {
                    setSelectedDate(date);
                  }}
                />
              </div>
              {params.date && (
                <div className="mx-2">
                  <SessionSlotList
                    selectedDate={new Date(params.date)}
                    slots={slots}
                    loading={isLoadingSlots}
                    onSelect={(slot) => {
                      gotoBookPage(slot);
                    }}
                  />
                </div>
              )}
            </div>
            <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
          </div>
        </div>
      </div>
    </SessionLayout>
  );
}
