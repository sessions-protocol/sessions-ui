import { useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { range } from "lodash";
import {
  getDay,
  startOfWeek,
  add,
  format,
  startOfMonth,
  getDate,
  isSameMonth,
  isSameDay,
  isBefore,
} from "date-fns";
import classNames from "classnames";

export interface SessionDayPickerProps {
  availableDates: string[];
  selected: Date | null;
  onSelect: (date: Date) => void;
}

export function SessionDayPicker(props: SessionDayPickerProps) {
  const selectedDate = props.selected || new Date()

  const [yearMonth, setYearMonth] = useState<Date>(selectedDate);

  const yearLabel = format(yearMonth, 'yyyy')
  const monthLabel = format(yearMonth, 'MMM')

  const dateInfo = useMemo(() => {
    const firstDayInMonth = startOfMonth(yearMonth);
    const weekdayOfFirstDayInMonth = getDay(firstDayInMonth);

    const weekdays = range(0, 7).map((i) => {
      let date = new Date(yearMonth);
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
      const selected = isSameDay(date, selectedDate);
      const available = props.availableDates.some((d) => isSameDay(date, new Date(d)))
      const whichMonth = (() => {
        if (isSameMonth(date, yearMonth)) {
          return "current" as const;
        } else if (isBefore(date, yearMonth)) {
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
  }, [yearMonth, selectedDate]);

  return (
    <div className="SessionDayPicker max-w-[420px]">
      <div className="mb-4 flex text-xl font-light text-gray-600">
        <span className="w-1/2 text-left text-gray-600 dark:text-white">
          <strong className="text-gray-900 dark:text-white">{monthLabel}</strong>{" "}
          <span className="text-gray-500">{yearLabel}</span>
        </span>
        <div className="w-1/2 text-right text-gray-600 dark:text-gray-400">
          <button
            onClick={() => {
              setYearMonth((date) => add(date, { months: -1 }));
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
              setYearMonth((date) => add(date, { months: 1 }));
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
                  if (!props.availableDates.some((i) => isSameDay(day.date, new Date(i)))) return;
                  props.onSelect(day.date);
                }}
              >
                <div className={classNames(
                  "absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center select-none text-gray-400 font-medium",
                  day.available ? "rounded cursor-pointer bg-gray-100 dark:bg-gray-600 dark:text-white hover:border-brand hover:border dark:hover:border-white" : "",
                  day.selected ? "bg-brand text-brandcontrast dark:bg-darkmodebrand dark:text-darkmodebrandcontrast" : "",
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
