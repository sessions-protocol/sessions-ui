import { useState } from "react";
import { SessionDayPicker } from "./components/SessionDayPicker";
import { ClockIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { BookPagePropsContext } from "../../pages/BookPage.param";

export interface BookProps {
  eventId: string;
}
export default function Book() {
  const { params, data } = BookPagePropsContext.usePageContext()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className={classNames("Book transition-max-width mx-auto duration-500 ease-in-out my-28", [
      selectedDate ? "max-w-5xl" : "max-w-3xl",
    ])}>
      <div className="flex flex-row p-4 rounded-sm border-gray-600 bg-gray-900 border">
        <div>
          <div className="pr-8 border-r dark:border-gray-800 flex flex-col items-start text-left">
            <h2 className="mt-3 font-medium text-gray-500 dark:text-gray-300">
              username
            </h2>
            <h1 className="font-cal mb-4 text-3xl font-semibold text-gray-800 dark:text-white">
              Session name
            </h1>
            <p className="mb-1 -ml-2 px-2 py-1 text-gray-500">
              <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              30 minutes
            </p>
            <p className="mt-3 mb-8 text-gray-600 dark:text-gray-200">
              Session Description
            </p>
          </div>
        </div>
        <div className="px-8">
          <SessionDayPicker
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
            }}
          />
        </div>
        <div className="w-1/3">Slot selector</div>
      </div>
    </div>
  );
}
