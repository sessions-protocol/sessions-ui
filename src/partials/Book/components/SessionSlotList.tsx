import classNames from "classnames";
import { format } from "date-fns";
import { ExclamationIcon } from "@heroicons/react/solid";
import { SessionSlot } from "@/types/Session";


export interface SessionSlotListProps {
  selectedDate: Date;
  error?: Error;
  loading?: boolean;
  slots?: SessionSlot[];
  onSelect: (slot: string) => void;
}
export function SessionSlotList(props: SessionSlotListProps) {

  return (
    <div className="flex flex-col text-center w-48">
      <div className="mb-8 text-left text-lg font-light text-gray-600">
        <div className="text-gray-600 dark:text-white">
          <span className="font-bold">{format(props.selectedDate, "EEEE")}</span>
          <span className="text-gray-500">{format(props.selectedDate, ", d LLLL")}</span>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto h-full">
        {!props.loading &&
          props.slots?.map((slot) => {
            return (
              <div
                key={slot.time}
                className={classNames(
                  "text-primary-500 mb-2 block rounded-sm border bg-white py-4 font-medium dark:border-transparent dark:bg-gray-600 dark:text-neutral-200 dark:hover:border-black cursor-pointer",
                  "hover:bg-brand hover:text-brandcontrast dark:hover:bg-darkmodebrand dark:hover:text-darkmodebrandcontrast hover:text-white",
                )}
                data-testid="time"
                onClick={() => {
                  console.log({slot})
                  props.onSelect(slot.time);
                }}
              >
                {slot.time}
              </div>
            );
          })}
        {!props.loading && !props.error && !props.slots?.length && (
          <div className="-mt-4 flex h-full w-full flex-col content-center items-center justify-center">
            <h1 className="my-6 text-xl text-black dark:text-white">All booked today.</h1>
          </div>
        )}

        {props.loading && "Loading..."}

        {props.error && (
          <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ltr:ml-3 rtl:mr-3">
                <p className="text-sm text-yellow-700">Slots load failed.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
