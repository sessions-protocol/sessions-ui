import { useState } from "react";
import { SessionDayPicker } from "./components/SessionDayPicker";
import { ClockIcon } from "@heroicons/react/solid";
import { BookPagePropsContext } from "@/pages/BookPage.param";
import { useQuery } from "react-query";
import { Session, SessionSlot } from "@/types/Session";
import { SessionSlotList } from "./components/SessionSlotList";
import { add } from "date-fns";



export function Book() {
  const { params } = BookPagePropsContext.usePageContext()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const {
    data: session,
    isLoading: isLoadingSession,
  } = useQuery<Session>(`Session:${params.sessionId}`, async () => {
    return {
      id: "1",
      user: {
        email: "user@example.com",
        address: "0x28Ba69e289c15f8a751eb929D81ec35e891A80e2",
      },
      title: "Session 1",
      duration: 60 * 50,
      availableDates: [
        new Date().toISOString(),
        add(new Date(), { days: 1}).toISOString(),
      ]
    }
  })
  const {
    data: slots,
    isLoading: isLoadingSlots,
  } = useQuery<SessionSlot[]>(`SessionSlots:${params.sessionId}:${selectedDate}`, async () => {
    return [
      { time: "09:00", booked: false },
      { time: "09:30", booked: false },
      { time: "10:00", booked: false },
    ]
  }, {
    enabled: !!selectedDate,
  })

  return (
    <div className="Book transition-all mx-auto duration-500 ease-in-out my-28">
      <div className="flex flex-row p-4 rounded-sm border-gray-600 bg-gray-900 border">
        <div className="max-w-96">
          <div className="pr-8 border-r dark:border-gray-800 flex flex-col items-start text-left h-full">
            <h2 className="mt-3 font-medium text-gray-500 dark:text-gray-300">
              {session?.user.email}
            </h2>
            <h1 className="font-cal mb-4 text-3xl font-semibold text-gray-800 dark:text-white">
              {session?.title}
            </h1>
            <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
              <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              {(session?.duration || 0) / 60} minutes
            </p>
            {session?.description && (
              <p className="mt-3 mb-8 text-gray-600 dark:text-gray-200">
                Session Description
              </p>
            )}
          </div>
        </div>
        <div className="px-8">
          <SessionDayPicker
            availableDates={session?.availableDates || []}
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
            }}
          />
        </div>
        {selectedDate && (
          <div className="mx-2">
            <SessionSlotList
              selectedDate={selectedDate}
              slots={slots}
              loading={isLoadingSlots}
              onSelect={(slot) => {
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
