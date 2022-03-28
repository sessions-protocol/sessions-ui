import { ParsedDateSlot, Session } from "@/types/Session";
import classNames from "classnames";
import { format } from "date-fns";
import { useTimezoneSettings } from "../../../hooks/useTimezoneSettings";


export interface SessionSlotListProps {
  session: Session;
  dateSlot: ParsedDateSlot;
  onSelect: (slot: Date) => void;
}
export function SessionSlotList(props: SessionSlotListProps) {
  const { settings } = useTimezoneSettings()

  return (
    <div className="flex flex-col text-center w-48">
      <div className="mb-8 text-left text-lg font-light text-gray-600">
        <div className="text-gray-600 dark:text-white">
          <span className="font-bold">{format(props.dateSlot.date, "EEE")}</span>
          <span className="text-gray-500">{format(props.dateSlot.date, ", d LLLL")}</span>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto h-full max-h-[300px] pr-4">
        {props.dateSlot.slots.length > 0 &&
          props.dateSlot.slots.map((slot) => {
            const label = format(slot.time, settings.clock24hour ? "HH:mm" : "hh:mm aa")
            return (
              <div
                key={slot.slot}
                className={classNames(
                  "text-primary-500 mb-2 block rounded-sm border bg-white py-4 font-medium dark:border-transparent dark:bg-gray-600 text-neutral-600 dark:text-neutral-200 dark:hover:border-black cursor-pointer",
                  "hover:bg-brand hover:text-brandcontrast dark:hover:bg-darkmodebrand dark:hover:text-darkmodebrandcontrast hover:text-white",
                )}
                data-testid="time"
                onClick={() => {
                  props.onSelect(slot.time);
                }}
              >
                {label}
              </div>
            );
          })}
        {!props.dateSlot.slots.length && (
          <div className="-mt-4 flex h-full w-full flex-col content-center items-center justify-center">
            <h1 className="my-6 text-xl text-black dark:text-white">No Available Slots.</h1>
          </div>
        )}
      </div>
    </div>
  );
}
