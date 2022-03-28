import { sessionApi } from "@/api/SessionApi";
import { ColorModeSwitcher } from "@/components/ColorModeSwitcher";
import { TimezoneSwitcher } from "@/components/TimezoneSwitcher";
import { SessionLayout } from "@/layout/SessionLayout";
import { SessionAvailablePagePropsContext } from "@/pages/SessionAvailablePage.param";
import { Availability, ParsedDateSlot, ParsedSlot, Session, SessionSlot } from "@/types/Session";
import { ClockIcon } from "@heroicons/react/solid";
import { add, endOfMonth, format, isSameDay, startOfDay, startOfMonth } from "date-fns";
import { chain, padStart } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTimezoneSettings } from "../../hooks/useTimezoneSettings";
import { SessionDayPicker } from "./components/SessionDayPicker";
import { SessionSlotList } from "./components/SessionSlotList";


export function SessionAvailable() {
  const navigate = useNavigate()
  const { current } = useTimezoneSettings()
  const [searchParams, setSearchParams] = useSearchParams();
  const { params } = SessionAvailablePagePropsContext.usePageContext()

  const [selectedDateSlot, setSelectedDateSlot] = useState<ParsedDateSlot | null>(null)
  const [yearMonth, setYearMonth] = useState<Date>(searchParams.get("date") ? new Date(searchParams.get("date") as any) : new Date());

  const yearMonthInfo = useMemo(() => {
    const label = format(yearMonth, "yyyy-MMM");
    const startTime = Math.round(new Date().getTime() / 1000)
    const endTime = Math.round(endOfMonth(yearMonth).getTime() / 1000)
    return { label, startTime, endTime }
  }, [yearMonth])

  const {
    data: session,
    isLoading: isLoadingSession,
    error: errorSession,
  } = useQuery<Session, Error>(`Session:${params.sessionId}`, async () => {
    return await sessionApi.getSession(params.sessionId)
  })
  const {
    data: availability,
    isLoading: isLoadingAvailability,
    error: errorAvailability,
  } = useQuery<Availability[], Error>(`Session:Availability:${params.sessionId}:${yearMonthInfo.label}`, async () => {
    return await sessionApi.getSessionAvailability(params.sessionId, yearMonthInfo.startTime, yearMonthInfo.endTime)
  })

  const dateSlots: { date: Date; slots: ParsedSlot[] }[] = useMemo(() => {
    if (!session) return [];
    if (!availability) return [];

    const utcAvailability = availability
    const utcDates = utcAvailability.map((i) => new Date(i.date))
    const utcSlotsChain = utcAvailability.map((i) => {
      const slotBigNum = i.availableSlot
      const slotsShort = slotBigNum.toBigInt().toString(2)
      const slotsFull = padStart(slotsShort, 240, "0")
      return slotsFull
    }).reduce((chain, i) => chain + i, "")

    const timezoneOffset = current.offset
    const slotOffset = timezoneOffset / 1000 / 60 / 6

    const timezoneDates = (() => {
      if (slotOffset < 0) {
        return [
          add(new Date(), { days: -1 }),
          ...utcDates,
        ]
      } else if (slotOffset > 0) {
        return [
          ...utcDates,
          add(utcDates[utcDates.length-1], { days: 1 }),
        ]
      } else {
        return Array.from(utcDates)
      }
    })()
    const timezoneSlotsChain = (() => {
      if (timezoneOffset > 0) {
        let slotsChain = String(utcSlotsChain)
        slotsChain = padStart("0", slotOffset, "0") + slotsChain
        slotsChain = slotsChain + padStart("0", 240 - slotOffset, "0")
        return slotsChain
      } else if (timezoneOffset < 0) {
        let slotsChain = String(utcSlotsChain)
        slotsChain = padStart("0", 240 + slotOffset, "0") + slotsChain
        slotsChain = slotsChain + padStart("0", -slotOffset, "0")
        return slotsChain
      } else {
        return String(utcSlotsChain)
      }
    })()
    const data = timezoneDates.map((date, index) => {
      const availableSlot = timezoneSlotsChain.slice(index * 240, (index + 1) * 240)
      const slots = chain(availableSlot)
        .split("")
        .reverse()
        .map((slot, sindex): ParsedSlot | null => {
          if (sindex % session.sessionType.durationInSlot !== 0) return null
          if (slot !== "1") return null
          const time = add(startOfDay(date), { minutes: sindex * 6 })
          if (time < new Date()) return null
          return {
            time: time,
            slot: sindex,
          }
        })
        .compact()
        .value()
      return {
        date,
        slots,
      }
    })
    return data
  }, [current.offset, session, availability])

  const availableDates = useMemo(() => {
    return dateSlots
      .filter((i) => i.slots.length > 0)
      .map((i) => i.date)
  }, [dateSlots])

  useEffect(() => {
    if (!params.date) return;
    if (!dateSlots || dateSlots.length === 0) return;
    const dateSlot = dateSlots.find((i) => isSameDay(i.date, new Date(params.date as any)))
    if (dateSlot) {
      setSelectedDateSlot(dateSlot)
    }
  }, [params.date, dateSlots])

  const setSelectedDate = useCallback((date: Date) => {
    setSearchParams({
      ...searchParams,
      date: date.toISOString(),
    })
  }, [searchParams, setSearchParams])

  const gotoBookPage = useCallback((slot: Date) => {
    if (!params.date) return;
    navigate(`/session/${params.sessionId}/book?time=${slot.toISOString()}`)
  }, [navigate, params])

  console.log({session})

  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="mb-2 flex flex-row justify-end gap-4">
            <ColorModeSwitcher />
          </div>
          <div className="SessionAvailable transition-all mx-auto duration-500 ease-in-out">
            {!session && (
              <div className="flex flex-row justify-center items-center min-h-[360px] min-w-[600px] p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border">
                {isLoadingSession && (
                  <div className="ml-2">Loading...</div>
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
              <div className="flex flex-row p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border">
                <div className="max-w-96">
                  <div className="pr-8 border-r dark:border-gray-600 flex flex-col items-start text-left h-full">
                    <h2 className="mt-3 font-medium text-gray-500 dark:text-gray-300">
                      @{session.user.handle}
                    </h2>
                    <h1 className="font-cal mb-4 text-3xl font-semibold">
                      {session.title}
                    </h1>
                    <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
                      <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                      {(session.duration || 0) / 60} minutes
                    </p>
                    {session.description && (
                      <p className="mt-3 mb-8 text-gray-500">
                        {session.description}
                      </p>
                    )}
                    <TimezoneSwitcher />
                  </div>
                </div>
                <div className="px-8">
                  <SessionDayPicker
                    isLoading={isLoadingAvailability}
                    session={session}
                    availableDates={availableDates}
                    yearMonth={yearMonth}
                    onYearMonthChange={(date) => { setYearMonth(date) }}
                    selected={(params.date && new Date(params.date)) || null}
                    onSelect={(date) => {
                      setSelectedDate(date);
                    }}
                  />
                </div>
                {params.date && selectedDateSlot && (
                  <div className="mx-2">
                    <SessionSlotList
                      session={session}
                      dateSlot={selectedDateSlot}
                      onSelect={(slot) => {
                        gotoBookPage(slot);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
          </div>
        </div>
      </div>
    </SessionLayout>
  );
}
