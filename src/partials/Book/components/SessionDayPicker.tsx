import { Availability, Session } from "@/types/Session";
import { Spinner } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { add, format, getDate, getDay, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { chain, padStart, range } from "lodash";
import { useMemo } from "react";
import { useTimezoneSettings } from "../../../hooks/useTimezoneSettings";

export interface SessionDayPickerProps {
  session: Session;
  isLoading?: boolean;
  availableDates: Date[];
  yearMonth: Date;
  onYearMonthChange: (yearMonth: Date) => void;
  selected: Date | null;
  onSelect: (date: Date) => void;
}

export function SessionDayPicker(props: SessionDayPickerProps) {

  const yearLabel = format(props.yearMonth, 'yyyy')
  const monthLabel = format(props.yearMonth, 'MMM')

  const dateInfo = useMemo(() => {
    const firstDayInMonth = startOfMonth(props.yearMonth);
    const weekdayOfFirstDayInMonth = getDay(firstDayInMonth);

    const weekdays = range(0, 7).map((i) => {
      let date = new Date(props.yearMonth);
      date = startOfWeek(date);
      date = add(date, { days: i });
      return {
        key: format(date, "yyyy-MM-dd"),
        date: date,
        label: format(date, "	EEE"),
      };
    });

    const days = range(
      1 - weekdayOfFirstDayInMonth,
      1 - weekdayOfFirstDayInMonth + 6 * 7
    ).map((i) => {
      const date = add(firstDayInMonth, { days: i - 1 });
      const selected = !!(props.selected && isSameDay(date, props.selected));
      const available = props.availableDates.some((d) => isSameDay(date, d))
      const whichMonth = (() => {
        if (isSameMonth(date, props.yearMonth)) {
          return "current" as const;
        } else if (isBefore(date, props.yearMonth)) {
          return "prev" as const;
        } else {
          return "next" as const;
        }
      })()
      return {
        key: format(date, "yyyy-MM-dd"),
        date: date,
        label: getDate(date),
        selected,
        available,
        whichMonth,
      };
    });

    return {
      weekdays,
      days,
    };
  }, [props.yearMonth, props.selected, props.availableDates]);

  return (
    <div className="SessionDayPicker max-w-[420px]">
      <div className="mb-4 flex text-xl font-light text-gray-600">
        <span className="w-1/2 text-left text-gray-600 dark:text-white">
          <strong className="text-gray-900 dark:text-white">{monthLabel}</strong>{" "}
          <span className="text-gray-500">{yearLabel}</span>
        </span>
        <div className="w-1/2 text-right text-gray-600 dark:text-gray-400">
          <div className="inline-block align-top mx-2">
          {props.isLoading && (
            <Spinner size={'xs'}/>
          )}
          </div>
          
          <button
            onClick={() => {
              props.onYearMonthChange(add(props.yearMonth, { months: -1 }));
            }}
            className={classNames(
              "group p-1 ltr:mr-2 rtl:ml-2",
              // isFirstMonth && "text-gray-400 dark:text-gray-600"
            )}
            // disabled={isFirstMonth}
          >
            <ChevronLeftIcon className="h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
          </button>
          <button
            className="group p-1"
            onClick={() => {
              props.onYearMonthChange(add(props.yearMonth, { months: 1 }));
            }}
          >
            <ChevronRightIcon className="h-5 w-5 group-hover:text-black dark:group-hover:text-white" />
          </button>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-7 gap-4 border-t border-b text-center dark:border-gray-800 sm:border-0">
          {dateInfo.weekdays.map((weekday) => {
            return (
              <div
                className="my-4 text-xs uppercase tracking-widest text-gray-500"
                key={weekday.key}
              >
                {weekday.label}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {dateInfo.days.map((day) => {
            if (day.whichMonth === "next") return null;

            return (
              <div
                className="relative w-full"
                style={{ paddingTop: "100%" }}
                key={day.key}
                onClick={() => {
                  if (day.whichMonth !== 'current') return;
                  if (!day.available) return;
                  props.onSelect(day.date);
                }}
              >
                <div className={classNames(
                  "absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center select-none font-medium",
                  day.available ? "text-gray-600 rounded cursor-pointer dark:text-white hover:border-brand hover:border dark:hover:border-white" : "text-gray-400",
                  day.selected ? "text-brandcontrast dark:text-darkmodebrandcontrast" : "",
                  day.available ? (day.selected ? "bg-brand dark:bg-darkmodebrand" : "bg-gray-100 dark:bg-gray-600") : "",
                  {
                  'hidden': day.whichMonth !== 'current',
                })}>
                  {day.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
